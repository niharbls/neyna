import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {Tabs, Layout, Typography, List, Card, Button, Modal, Spin, Tooltip} from 'antd';
import { 
  FileOutlined, 
  PictureOutlined, 
  DownloadOutlined, 
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import Terms from './Terms';
import Advertise from './Advertise';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Header, Content } = Layout;
const { Title } = Typography;

interface FileItem {
    name: string;
    path: string;
    thumbnail?: string;
}

function HomePage() {
    const navigate = useNavigate();
    const [pdfs, setPdfs] = useState<FileItem[]>([]);
    const [images, setImages] = useState<FileItem[]>([]);
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
    const [pdfZoomLevel, setPdfZoomLevel] = useState<number>(1);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const pdfContainerRef = useRef<HTMLDivElement>(null);

    // Load files from public folder

    // Function to dynamically get files from public folder
    const getPublicFiles = () => {
        try {
            const pdfFiles: FileItem[] = [];
            const imageFiles: FileItem[] = [];

            // Get all PDF files from public/pdfs directory
            const pdfModules = import.meta.glob('/public/pdfs/*.pdf', { eager: false });
            
            // Get all image files from public/images directory
            const imageModules = import.meta.glob('/public/images/*.{png,jpg,jpeg,gif,webp,avif}', { eager: false });

            // Process PDF files
            Object.keys(pdfModules).forEach(key => {
                const fileName = key.split('/').pop() || '';
                const relativePath = key.replace('/public', '');
                
                console.log('Found PDF:', fileName, 'at path:', relativePath);
                
                pdfFiles.push({
                    name: fileName,
                    path: relativePath,
                    thumbnail: relativePath
                });
            });

            // Process image files
            Object.keys(imageModules).forEach(key => {
                const fileName = key.split('/').pop() || '';
                const relativePath = key.replace('/public', '');
                
                console.log('Found Image:', fileName, 'at path:', relativePath);
                
                imageFiles.push({
                    name: fileName,
                    path: relativePath,
                    thumbnail: relativePath
                });
            });

            console.log(`Loaded ${pdfFiles.length} PDF files and ${imageFiles.length} image files`);
            return {pdfFiles, imageFiles};
        } catch (error) {
            console.error('Error loading files:', error);
            return {pdfFiles: [], imageFiles: []};
        }
    };

    useEffect(() => {
        const loadFiles = async () => {
            try {
                // Get files from public folder
                const { pdfFiles, imageFiles } = getPublicFiles();
                
                // Update state with the files
                setPdfs(pdfFiles);
                setImages(imageFiles);
                
                // Log success message
                console.log(`Successfully loaded ${pdfFiles.length} PDF files and ${imageFiles.length} image files`);
                
                if (pdfFiles.length === 0) {
                    console.warn('No PDF files found in public/pdfs folder. Make sure PDF files are placed in the public/pdfs directory.');
                }
                
                if (imageFiles.length === 0) {
                    console.warn('No image files found in public/images folder. Make sure image files are placed in the public/images directory.');
                }
            } catch (error) {
                // Log error and set empty arrays to prevent the application from crashing
                console.error('Error loading files:', error);
                setPdfs([]);
                setImages([]);
            }
        };
        
        loadFiles();
        
        // Set up interval to check for new files every 30 seconds
        const interval = setInterval(() => {
            console.log('Checking for new files...');
            loadFiles();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // No search filtering needed

    const handleDownload = (path: string, fileName: string) => {
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = path;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const showPreview = (item: FileItem) => {
        const isPdf = item.name.toLowerCase().endsWith('.pdf') || item.path.includes('/pdfs/');
        
        // Reset zoom level and set loading state for PDFs
        if (isPdf) {
            setPdfZoomLevel(1);
            setIsLoading(true);
        }
        
        setPreviewItem(item);
        setPreviewVisible(true);
    };

    const closePreview = () => {
        setPreviewVisible(false);
        setPreviewItem(null);
    };

    const handleZoomIn = () => {
        setPdfZoomLevel(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setPdfZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleReload = () => {
        setIsLoading(true);
        // Force iframe reload by changing the src slightly
        if (previewItem && pdfContainerRef.current) {
            const iframe = pdfContainerRef.current.querySelector('iframe');
            if (iframe) {
                const currentSrc = iframe.src;
                iframe.src = '';
                setTimeout(() => {
                    iframe.src = currentSrc;
                    setIsLoading(false);
                }, 100);
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    const toggleFullscreen = () => {
        if (!pdfContainerRef.current) return;
        
        if (!isFullscreen) {
            if (pdfContainerRef.current.requestFullscreen) {
                pdfContainerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Handle fullscreen change event
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const renderPreviewContent = () => {
        if (!previewItem) return null;

        const isPdf = previewItem.name.toLowerCase().endsWith('.pdf') || previewItem.path.includes('/pdfs/');

        if (isPdf) {
            return (
                <div className="pdf-preview-container" ref={pdfContainerRef}>
                    {isLoading && (
                        <div className="pdf-loading">
                            <Spin size="large" tip="Loading PDF..." />
                        </div>
                    )}
                    <div className="pdf-controls">
                        <Tooltip title="Zoom Out">
                            <Button 
                                icon={<ZoomOutOutlined />} 
                                onClick={handleZoomOut}
                                disabled={pdfZoomLevel <= 0.5}
                            />
                        </Tooltip>
                        <span className="zoom-level">{Math.round(pdfZoomLevel * 100)}%</span>
                        <Tooltip title="Zoom In">
                            <Button 
                                icon={<ZoomInOutlined />} 
                                onClick={handleZoomIn}
                                disabled={pdfZoomLevel >= 3}
                            />
                        </Tooltip>
                        <Tooltip title="Reload PDF">
                            <Button 
                                icon={<ReloadOutlined />} 
                                onClick={handleReload}
                            />
                        </Tooltip>
                        <Tooltip title="Fullscreen">
                            <Button 
                                icon={<FullscreenOutlined />} 
                                onClick={toggleFullscreen}
                            />
                        </Tooltip>
                    </div>
                    <iframe
                        src={previewItem.path}
                        title={previewItem.name}
                        width="100%"
                        height="95vh"
                        style={{ 
                            border: 'none',
                            transform: `scale(${pdfZoomLevel})`,
                            transformOrigin: 'top center',
                            transition: 'transform 0.2s ease'
                        }}
                        onLoad={() => setIsLoading(false)}
                    >
                        <p>Your browser does not support PDF preview. <a href={previewItem.path} download={previewItem.name}>Download instead</a></p>
                    </iframe>
                </div>
            );
        } else {
            return (
                <div className="image-preview-container">
                    <img
                        src={previewItem.path}
                        alt={previewItem.name}
                        style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block' }}
                    />
                </div>
            );
        }
    };

    function renderFileList(items: FileItem[], icon: typeof FileOutlined) {
        return (
            <List
                className="file-grid"
                grid={{
                    gutter: 16,
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 5,
                    xl: 6,
                    xxl: 8,
                }}
                dataSource={items}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            hoverable
                            className="file-card"
                            bodyStyle={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            cover={
                                <div className="thumbnail-container" onClick={() => showPreview(item)}>
                                    {item.name.toLowerCase().endsWith('.pdf') || item.path.includes('/pdfs/') ? (
                                        <div className="pdf-thumbnail">
                                            <Document 
                                                file={item.path.startsWith('/') ? item.path : '/' + item.path}
                                                loading={<FileOutlined className="file-icon" style={{ color: '#ff6b00' }} />} 
                                                error={<FileOutlined className="file-icon" style={{ color: '#ff6b00' }} />}
                                            >
                                                <Page pageNumber={1} width={100} />
                                            </Document>
                                            <span className="pdf-label">PDF</span>
                                        </div>
                                    ) : item.thumbnail ? (
                                        <div className="image-thumbnail-wrapper">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                className="file-thumbnail"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = '';
                                                    target.style.display = 'none';
                                                    const parent = target.parentNode as HTMLElement;
                                                    if (parent) {
                                                        const icon = document.createElement('span');
                                                        icon.className = 'anticon anticon-picture file-icon';
                                                        icon.style.color = '#ff6b00';
                                                        icon.style.fontSize = '40px';
                                                        parent.appendChild(icon);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : icon === FileOutlined ? (
                                        <FileOutlined className="file-icon" style={{ color: '#ff6b00' }} />
                                    ) : (
                                        <PictureOutlined className="file-icon" style={{ color: '#ff6b00' }} />
                                    )}
                                </div>
                            }
                            onClick={() => showPreview(item)}
                        >
                            <p className="file-name">{item.name}</p>
                            <div className="file-actions">
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    className="download-button"
                                    size="middle"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click event
                                        handleDownload(item.path, item.name);
                                    }}
                                >
                                    Download
                                </Button>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        );
    }

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

    const fileTabItems = [
        {
            key: '2',
            label: (
                <span>
          <PictureOutlined /> Images {images.length > 0 ? `(${images.length})` : ''}
        </span>
            ),
            children: renderFileList(images, PictureOutlined),
        },
        {
            key: '1',
            label: (
                <span>
          <FileOutlined /> PDFs {pdfs.length > 0 ? `(${pdfs.length})` : ''}
        </span>
            ),
            children: renderFileList(pdfs, FileOutlined),
        },
    ];

    return (
        <Layout>
            <Header className="app-header">
                <div className="header-content">
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Title level={2} style={{ color: 'white', margin: '14px 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: 0 }}>
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
                        activeKey="downloads" 
                        items={tabItems} 
                        size="middle" 
                        onChange={handleTabChange}
                    />
                    <Tabs defaultActiveKey="2" items={fileTabItems} size="middle" />
                </div>
            </Content>

            <Modal
                open={previewVisible}
                onCancel={closePreview}
                footer={
                    previewItem && (previewItem.name.toLowerCase().endsWith('.pdf') || previewItem.path.includes('/pdfs/')) ? 
                    [
                        <Button key="fullscreen" onClick={toggleFullscreen}>
                            <FullscreenOutlined /> {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </Button>,
                        <Button key="reload" onClick={handleReload}>
                            <ReloadOutlined /> Reload
                        </Button>,
                        <Button key="download" type="primary" onClick={() => previewItem && handleDownload(previewItem.path, previewItem.name)}>
                            <DownloadOutlined /> Download
                        </Button>,
                        <Button key="close" onClick={closePreview}>
                            Close
                        </Button>
                    ] : 
                    [
                        <Button key="download" type="primary" onClick={() => previewItem && handleDownload(previewItem.path, previewItem.name)}>
                            <DownloadOutlined /> Download
                        </Button>,
                        <Button key="close" onClick={closePreview}>
                            Close
                        </Button>
                    ]
                }
                width="85%"
                title={previewItem?.name}
                centered
                bodyStyle={{ padding: '8px', borderRadius: '8px' }}
                style={{ maxWidth: '85vw', borderRadius: '8px' }}
            >
                {renderPreviewContent()}
            </Modal>
        </Layout>
    );
}

function App() {
    return (
    <>
        <Routes>
            <Route path="/" element={<Advertise />} />
            <Route path="/downloads" element={<HomePage />} />
            <Route path="/terms" element={<Terms />} />
        </Routes>
        
        {/* Floating WhatsApp Button */}
        <a 
            href="https://wa.me/+919040987452" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                backgroundColor: '#25D366',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
        >
            <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="white"
            >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
        </a>
    </>
    );
}

export default App;