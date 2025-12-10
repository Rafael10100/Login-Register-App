import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Alert,
  Tab,
  Tabs
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaDatabase
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const { user, logout, getProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    lastLogin: 'Hoje',
    sessions: 1,
    accountAge: 'Novo'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setProfile(response.user);

        // Simular estatísticas
        if (response.user) {
          const created = new Date(response.user.created_at);
          const now = new Date();
          const diffTime = Math.abs(now - created);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          setStats({
            lastLogin: 'Hoje às ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            sessions: Math.floor(Math.random() * 10) + 1,
            accountAge: diffDays === 1 ? '1 dia' : `${diffDays} dias`
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        toast.error('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, getProfile]);

  const handleLogout = () => {
    logout();
    toast.info('Logout realizado com sucesso!');
    setTimeout(() => navigate('/login'), 1000);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <ToastContainer />
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Dashboard</h1>
              <p className="text-muted mb-0">
                Bem-vindo de volta, <span className="fw-bold text-primary">{user?.username}</span>
              </p>
            </div>
            <Badge bg="success" pill className="px-3 py-2">
              <FaShieldAlt className="me-2" />
              Conta Verificada
            </Badge>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="card-shadow border-0 mb-4">
            <Card.Body className="p-4">
              <Tabs defaultActiveKey="profile" className="mb-3">
                <Tab eventKey="profile" title="Perfil">
                  <Row className="mt-3">
                    <Col md={4} className="text-center">
                      <div className="bg-gradient rounded-circle d-inline-flex p-4 mb-3"
                           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <FaUser size={48} className="text-white" />
                      </div>
                      <h4>{user?.username}</h4>
                      <Badge bg="info" className="mb-3">Usuário</Badge>
                    </Col>
                    <Col md={8}>
                      <h5 className="mb-3">Informações da Conta</h5>
                      <Row>
                        <Col md={6} className="mb-3">
                          <div className="d-flex align-items-center">
                            <FaUser className="text-primary me-2" />
                            <div>
                              <small className="text-muted">Nome de Usuário</small>
                              <p className="mb-0 fw-bold">{user?.username}</p>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex align-items-center">
                            <FaEnvelope className="text-primary me-2" />
                            <div>
                              <small className="text-muted">Email</small>
                              <p className="mb-0 fw-bold">{user?.email}</p>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="text-primary me-2" />
                            <div>
                              <small className="text-muted">Membro desde</small>
                              <p className="mb-0 fw-bold">
                                {profile ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex align-items-center">
                            <FaDatabase className="text-primary me-2" />
                            <div>
                              <small className="text-muted">ID da Conta</small>
                              <p className="mb-0 fw-bold">{user?.id}</p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="stats" title="Estatísticas">
                  <Row className="mt-3">
                    <Col md={4} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body className="text-center">
                          <FaCalendarAlt size={32} className="text-primary mb-3" />
                          <h3>{stats.accountAge}</h3>
                          <p className="text-muted mb-0">Tempo de conta</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body className="text-center">
                          <FaChartLine size={32} className="text-success mb-3" />
                          <h3>{stats.sessions}</h3>
                          <p className="text-muted mb-0">Sessões ativas</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body className="text-center">
                          <FaShieldAlt size={32} className="text-warning mb-3" />
                          <h3>100%</h3>
                          <p className="text-muted mb-0">Segurança</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="settings" title="Configurações">
                  <div className="mt-3">
                    <h5 className="mb-3">Preferências da Conta</h5>
                    <Alert variant="info">
                      <FaCog className="me-2" />
                      Configurações avançadas em breve!
                    </Alert>
                    <div className="form-check form-switch mb-3">
                      <input className="form-check-input" type="checkbox" id="notifications" />
                      <label className="form-check-label" htmlFor="notifications">
                        Notificações por email
                      </label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input className="form-check-input" type="checkbox" id="darkMode" />
                      <label className="form-check-label" htmlFor="darkMode">
                        Modo escuro
                      </label>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Card de Ações Rápidas */}
          <Card className="card-shadow border-0 mb-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Ações Rápidas</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" className="mb-2">
                  <FaCog className="me-2" />
                  Editar Perfil
                </Button>
                <Button variant="outline-success" className="mb-2">
                  <FaShieldAlt className="me-2" />
                  Segurança
                </Button>
                <Button variant="outline-warning" className="mb-2">
                  <FaEnvelope className="me-2" />
                  Alterar Email
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleLogout}
                  className="mt-3"
                >
                  <FaSignOutAlt className="me-2" />
                  Sair da Conta
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Card de Atividade Recente */}
          <Card className="card-shadow border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Atividade Recente</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-gradient rounded-circle p-2">
                        <FaUser className="text-white" size={14} />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <small className="text-muted">Hoje</small>
                      <p className="mb-0">Login realizado com sucesso</p>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-info bg-gradient rounded-circle p-2">
                        <FaShieldAlt className="text-white" size={14} />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <small className="text-muted">{stats.accountAge} atrás</small>
                      <p className="mb-0">Conta criada</p>
                    </div>
                  </div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Card de Informações do Sistema */}
      <Card className="card-shadow border-0">
        <Card.Body className="p-4">
          <Row>
            <Col md={4} className="mb-3">
              <h6 className="fw-bold">Status do Sistema</h6>
              <Badge bg="success" className="me-2">Online</Badge>
              <Badge bg="info">Estável</Badge>
            </Col>
            <Col md={4} className="mb-3">
              <h6 className="fw-bold">Último Login</h6>
              <p className="mb-0 text-muted">{stats.lastLogin}</p>
            </Col>
            <Col md={4} className="mb-3">
              <h6 className="fw-bold">Sessões Ativas</h6>
              <p className="mb-0 text-muted">{stats.sessions}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;