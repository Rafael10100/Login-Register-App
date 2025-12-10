import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login realizado com sucesso!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.error(result.error || 'Erro ao fazer login');
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  return (
    <Container className="py-5">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={6} lg={5} xl={4}>
          <Card className="card-shadow border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-gradient rounded-circle d-inline-flex p-3 mb-3">
                  <FaSignInAlt size={32} className="text-white" />
                </div>
                <h2 className="fw-bold">Login</h2>
                <p className="text-muted">Entre na sua conta para continuar</p>
              </div>

              {errors.general && (
                <Alert variant="danger" className="text-center">
                  {errors.general}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="seu@email.com"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Sua senha"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-gradient w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="text-decoration-none fw-bold">
                      Registre-se aqui
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Cards informativos */}
          <Row className="mt-4">
            <Col md={6} className="mb-3">
              <Card className="text-center border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold">Usuário de Teste</h6>
                  <small className="text-muted">
                    Email: teste@email.com<br />
                    Senha: 123456
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold">Segurança</h6>
                  <small className="text-muted">
                    Sua senha é criptografada e protegida
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;