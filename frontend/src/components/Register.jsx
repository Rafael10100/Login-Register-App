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
  Spinner,
  ProgressBar
} from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
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

    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      toast.success('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.error(result.error || 'Erro ao realizar cadastro');
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };

  return (
    <Container className="py-5">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="card-shadow border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-success bg-gradient rounded-circle d-inline-flex p-3 mb-3">
                  <FaUserPlus size={32} className="text-white" />
                </div>
                <h2 className="fw-bold">Criar Conta</h2>
                <p className="text-muted">Preencha os dados para se registrar</p>
              </div>

              {errors.general && (
                <Alert variant="danger" className="text-center">
                  {errors.general}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome de Usuário</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          isInvalid={!!errors.username}
                          placeholder="seu_nome"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

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

                <Form.Group className="mb-3">
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
                      placeholder="Mínimo 6 caracteres"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <small className="d-block mb-1">Força da senha:</small>
                      <ProgressBar 
                        now={passwordStrength} 
                        variant={getPasswordStrengthColor()}
                        className="mb-2"
                      />
                      <small className="text-muted">
                        {passwordStrength < 50 && 'Senha fraca'}
                        {passwordStrength >= 50 && passwordStrength < 75 && 'Senha moderada'}
                        {passwordStrength >= 75 && 'Senha forte'}
                      </small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="Confirme sua senha"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <div className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="terms"
                    label={
                      <>
                        Eu concordo com os{' '}
                        <a href="#!" className="text-decoration-none">
                          Termos de Serviço
                        </a>{' '}
                        e{' '}
                        <a href="#!" className="text-decoration-none">
                          Política de Privacidade
                        </a>
                      </>
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="success"
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
                      Registrando...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold">
                      Faça login aqui
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Cards informativos */}
          <Row className="mt-4">
            <Col md={4} className="mb-3">
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body>
                  <FaUser className="text-primary mb-2" size={24} />
                  <h6 className="fw-bold">Perfil Personalizado</h6>
                  <small className="text-muted">
                    Crie seu perfil único com username personalizado
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body>
                  <FaLock className="text-success mb-2" size={24} />
                  <h6 className="fw-bold">Segurança Total</h6>
                  <small className="text-muted">
                    Senhas criptografadas com bcrypt
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body>
                  <FaEnvelope className="text-info mb-2" size={24} />
                  <h6 className="fw-bold">Email Único</h6>
                  <small className="text-muted">
                    Garantia de email único por conta
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

export default Register;