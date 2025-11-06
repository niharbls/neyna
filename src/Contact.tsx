import React from 'react';
import { Layout, Typography, Card, Row, Col, Divider, Tabs } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Contact.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Contact: React.FC = () => {
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
      key: 'contact',
      label: (
        <span>
          <PhoneOutlined /> Contact
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
      case 'contact':
        navigate('/contact');
        break;
      case 'terms':
        navigate('/terms');
        break;
    }
  };

  return (
    <Layout className="contact-layout">
      <Header className="app-header contact-header">
        <div className="header-content">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <Title level={2} style={{ color: 'white', margin: '14px 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)', cursor: 'pointer' }}>
              Neyna
            </Title>
          </Link>
        </div>
      </Header>
      <Content className="contact-content">
        <div className="content-wrapper">
          <Tabs 
            activeKey="contact" 
            items={tabItems} 
            size="middle" 
            onChange={handleTabChange}
          />
          <div className="contact-wrapper">
            <Card className="contact-card">
            <Title level={2}>Contact</Title>
            <Paragraph className="contact-intro">
              We're here to help! If you have any questions about our services or need assistance, please don't hesitate to reach out to us.
            </Paragraph>

            <Divider />

            <Row gutter={[24, 24]} className="contact-info-section">
              <Col xs={24} sm={24} md={8}>
                <Card className="contact-info-card">
                  <PhoneOutlined className="contact-icon" />
                  <Title level={4}>Phone</Title>
                  <Paragraph className="contact-detail">
                    <a href="tel:+919040987452">+91 9040 987 452</a>
                  </Paragraph>
                  <Paragraph className="contact-note">
                    Available Monday-Friday, 9AM-6PM IST
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Card className="contact-info-card">
                  <MailOutlined className="contact-icon" />
                  <Title level={4}>Email</Title>
                  <Paragraph className="contact-detail">
                    <a href="mailto: niharbaleshwar@gmail.com">niharbaleshwar@gmail.com</a>
                  </Paragraph>
                  <Paragraph className="contact-note">
                    We'll respond as soon as possible
                  </Paragraph>
                </Card>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Card className="contact-info-card">
                  <EnvironmentOutlined className="contact-icon" />
                  <Title level={4}>Address</Title>
                  <Paragraph className="contact-detail">
                    Nitish welding work
                    
                    Rameshwar nagar
                    baleshwa,
                    odisha<br />
                    , India 756001
                  </Paragraph>
                  <Paragraph className="contact-note">
                    Visit us during business hours
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Title level={3} className="follow-us-title">Follow Us</Title>
            <Paragraph className="follow-us-text">
              Stay connected with us on social media for updates and more.
              
            </Paragraph>
            <div className="social-icons">
               <a href="#">Facebook</a>
                <a href="#">YouTube </a>
            </div>

          </Card>
          </div>
        </div>

      </Content>
    </Layout>
  );
};

export default Contact;
