import React from 'react';
import { Layout, Typography, Tabs, Card, Row, Col, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { FileTextOutlined, PhoneOutlined, DownloadOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Advertise: React.FC = () => {
  const navigate = useNavigate();

  const tabItems = [
    {
      key: 'advertise',
      label: (
        <span>
          <FileTextOutlined /> Advertise
        </span>
      ),
    },
    {
      key: 'downloads',
      label: (
        <span>
          <DownloadOutlined /> Download files
        </span>
      ),
    },
    {
      key: 'terms',
      label: (
        <span>
          <FileTextOutlined /> Terms
        </span>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    switch (key) {
      case 'advertise':
        navigate('/');
        break;
      case 'downloads':
        navigate('/downloads');
        break;
      case 'terms':
        navigate('/terms');
        break;
    }
  };

  return (
    <Layout>
      <Header className="app-header">
        <div className="header-content">
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Title level={2} style={{ color: 'white', margin: '14px 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)', cursor: 'pointer', marginBottom: 0 }}>
              NEYNA
            </Title>
            <span style={{ 
              color: 'white', 
              fontSize: 'clamp(0.8rem, 2vw, 1rem)', 
              fontWeight: 300,
              opacity: 0.9,
              marginTop: '4px'
            }}>
              show you everything
            </span>
          </Link>
        </div>
      </Header>
      <Content>
        <div className="content-wrapper">
          <Tabs 
            activeKey="advertise" 
            items={tabItems} 
            size="middle" 
            onChange={handleTabChange}
          />
          <div style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 160px)' }}>
            {/* Video Player Section - 80% of screen */}
            <div style={{ 
              width: '100%', 
              height: '80vh', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 32
            }}>
              <video 
                controls 
                autoPlay
                muted
                loop
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  maxWidth: '100%', 
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                poster="/videos/file_example_MP4_640_3MG.mp4"
              >
                <source src="/videos/file_example_MP4_640_3MG.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Contact Section */}
            <Card style={{ maxWidth: 1200, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Title level={2} style={{ textAlign: 'center', color: '#ff6b00', marginBottom: 32 }}>Contact Us</Title>
              
              <Row gutter={[24, 24]} className="contact-info-section">
                <Col xs={24} sm={24} md={8}>
                  <Card className="contact-info-card" style={{ textAlign: 'center', height: '100%' }}>
                    <PhoneOutlined style={{ fontSize: 32, color: '#ff6b00', marginBottom: 16 }} />
                    <Title level={4}>Phone</Title>
                    <Paragraph style={{ fontSize: 18, fontWeight: 'bold', color: '#ff6b00' }}>
                      <a href="tel:+919040987452" style={{ color: '#ff6b00' }}>+91 9040 987 452</a>
                    </Paragraph>
                    <Paragraph style={{ color: '#666' }}>
                      Available Monday-Friday, 9AM-6PM IST
                    </Paragraph>
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={8}>
                  <Card className="contact-info-card" style={{ textAlign: 'center', height: '100%' }}>
                    <MailOutlined style={{ fontSize: 32, color: '#ff6b00', marginBottom: 16 }} />
                    <Title level={4}>Email</Title>
                    <Paragraph style={{ fontSize: 18, fontWeight: 'bold', color: '#ff6b00' }}>
                      <a href="mailto:niharbaleshwar@gmail.com" style={{ color: '#ff6b00' }}>niharbaleshwar@gmail.com</a>
                    </Paragraph>
                    <Paragraph style={{ color: '#666' }}>
                      We'll respond as soon as possible
                    </Paragraph>
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={8}>
                  <Card className="contact-info-card" style={{ textAlign: 'center', height: '100%' }}>
                    <EnvironmentOutlined style={{ fontSize: 32, color: '#ff6b00', marginBottom: 16 }} />
                    <Title level={4}>Address</Title>
                    <Paragraph style={{ fontSize: 16, color: '#333' }}>
                      Nitish welding work<br />
                      Rameshwar nagar<br />
                      Baleshwar, Odisha<br />
                      India 756001
                    </Paragraph>
                    <Paragraph style={{ color: '#666' }}>
                      Visit us during business hours
                    </Paragraph>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: '#ff6b00' }}>NITESH WELDING WORK</Title>
                <Paragraph style={{ fontSize: 18, color: '#333', marginBottom: 16 }}>
                  ALL INDUSTRIAL FABRICATION AND ERECTION DONE HERE
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <a href="#" style={{ color: '#ff6b00', fontSize: 16 }}>Facebook</a>
                  <a href="#" style={{ color: '#ff6b00', fontSize: 16 }}>YouTube</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Advertise;
