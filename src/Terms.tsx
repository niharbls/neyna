import React from 'react';
import {Layout, Typography, Card, Divider} from 'antd';
import {FileTextOutlined, PhoneOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import './Terms.css';

const {Header, Content} = Layout;
const {Title, Paragraph} = Typography;

const Terms: React.FC = () => {
    return (
        <Layout className="terms-layout">
            <Header className="app-header terms-header">
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
                        <span className="current-page">
                          <FileTextOutlined/> Terms
                        </span>
                    </div>
                </div>
            </Header>
            <Content className="terms-content">
                <div className="terms-wrapper">
                    <Card className="terms-card">
                        <Title level={2}>Terms</Title>
                        <Paragraph className="terms-intro">
                            Last updated: July 17, 2025
                        </Paragraph>
                        <Paragraph className="terms-intro">
                            Please read these terms carefully before using our services.
                        </Paragraph>

                        <Divider />

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>1. Introduction</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                Welcome to Neyna ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms
                                of Service") govern your use of our website and services operated by Neyna.
                            </Paragraph>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                By accessing or using our service, you agree to be bound by these Terms. If you disagree
                                with any part of the terms, you may not access the service.
                            </Paragraph>
                        </div>

                        <div className="terms-section" style={{marginBottom: '2rem'}}>
                            <Title level={3} style={{marginBottom: '1rem'}}>2. Use of Services</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                Our services allow you to view, download, and share documents and images. You are
                                responsible for maintaining the confidentiality of your account and for all activities
                                that occur under your account.
                            </Paragraph>
                            <Paragraph style={{marginBottom: '0.5rem'}}>
                                You agree not to use our services:
                            </Paragraph>
                            <ul className="terms-list" style={{marginBottom: '1rem', paddingLeft: '2rem'}}>
                                <li>In any way that violates any applicable national or international law or
                                    regulation.
                                </li>
                                <li>To transmit, or procure the sending of, any advertising or promotional material,
                                    including any "junk mail", "chain letter," "spam," or any other similar
                                    solicitation.
                                </li>
                                <li>To impersonate or attempt to impersonate the Company, a Company employee, another
                                    user, or any other person or entity.
                                </li>
                                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment
                                    of the Service, or which, as determined by us, may harm the Company or users of the
                                    Service or expose them to liability.
                                </li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>3. Intellectual Property</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                The Service and its original content, features, and functionality are and will remain
                                the exclusive property of Neyna and its licensors. The Service is protected by
                                copyright, trademark, and other laws of both the India and foreign countries. Our
                                trademarks and trade dress may not be used in connection with any product or service
                                without the prior written consent of Neyna.
                            </Paragraph>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>4. User Content</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                Our Service allows you to post, link, store, share and otherwise make available certain
                                information, text, graphics, videos, or other material. You are responsible for the
                                content that you upload to our service.
                            </Paragraph>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                By posting content to our service, you grant us the right to use, modify, publicly
                                perform, publicly display, reproduce, and distribute such content on and through the
                                Service. You retain any and all of your rights to any content you submit, post or
                                display on or through the Service and you are responsible for protecting those rights.
                            </Paragraph>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>5. Termination</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                We may terminate or suspend your account immediately, without prior notice or liability,
                                for any reason whatsoever, including without limitation if you breach the Terms.
                            </Paragraph>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                Upon termination, your right to use the Service will immediately cease. If you wish to
                                terminate your account, you may simply discontinue using the Service.
                            </Paragraph>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>6. Limitation of Liability</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                In no event shall Neyna, nor its directors, employees, partners, agents, suppliers, or
                                affiliates, be liable for any indirect, incidental, special, consequential or punitive
                                damages, including without limitation, loss of profits, data, use, goodwill, or other
                                intangible losses, resulting from:
                            </Paragraph>
                            <ul className="terms-list" style={{marginBottom: '1rem', paddingLeft: '2rem'}}>
                                <li>Your access to or use of or inability to access or use the Service;</li>
                                <li>Any conduct or content of any third party on the Service;</li>
                                <li>Any content obtained from the Service; and</li>
                                <li>Unauthorized access, use or alteration of your transmissions or content.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>7. Governing Law</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                These Terms shall be governed and construed in accordance with the laws of India,
                                without regard to its conflict of law provisions.
                            </Paragraph>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                Our failure to enforce any right or provision of these Terms will not be considered a
                                waiver of those rights. If any provision of these Terms is held to be invalid or
                                unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                            </Paragraph>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>8. Changes to Terms</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any
                                time. If a revision is material we will try to provide at least 30 days notice prior to
                                any new terms taking effect. What constitutes a material change will be determined at
                                our sole discretion.
                            </Paragraph>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                By continuing to access or use our Service after those revisions become effective, you
                                agree to be bound by the revised terms. If you do not agree to the new terms, please
                                stop using the Service.
                            </Paragraph>
                        </div>

                        <div className="terms-section">
                            <Title level={3} style={{marginBottom: '1rem'}}>Contact Us</Title>
                            <Paragraph style={{marginBottom: '1rem'}}>
                                If you have any questions about these Terms, please <Link to="/contact">contact
                                us</Link>.
                            </Paragraph>
                        </div>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};

export default Terms;