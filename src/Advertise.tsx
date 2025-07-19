import React from 'react';
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { FileTextOutlined, PhoneOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Advertise: React.FC = () => {
  return (
    <Layout>
      <Header className="app-header">
        <div className="header-content">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <Title level={2} style={{ color: 'white', margin: '14px 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)', cursor: 'pointer' }}>
              Neyna
            </Title>
          </Link>
          <div className="nav-controls">
            <Link to="/advertise" className="contact-link">
              <FileTextOutlined /> Advertise
            </Link>
            <Link to="/contact" className="contact-link">
              <PhoneOutlined /> Contact
            </Link>
            <Link to="/terms" className="contact-link">
              <FileTextOutlined /> Terms
            </Link>
          </div>
        </div>
      </Header>
      <Content style={{ marginTop: 64, padding: 24, minHeight: 'calc(100vh - 64px)', background: '#f5f5f5' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Title level={2} style={{ textAlign: 'center', color: '#ff6b00' }}>Advertise with us</Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 18, margin: '24px 0' }}>
            Reach thousands of users by advertising on Neyna.<br />
            For advertising inquiries, contact us at:
          </Paragraph>
          <Paragraph style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: '#ff6b00', marginBottom: 0 }}>
            +91 9040 987 452
          </Paragraph>
        </div>
      </Content>
    </Layout>
  );
};

export default Advertise;
