import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {Tabs, Layout, Typography, List, Card, Input, Button, Modal, Spin, Tooltip, Drawer} from 'antd';
import { 
  FileOutlined, 
  PictureOutlined, 
  SearchOutlined, 
  DownloadOutlined, 
  PhoneOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  FileTextOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import Contact from './Contact';
import Terms from './Terms';
import Advertise from './Advertise';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

interface FileItem {
    name: string;
    path: string;
    thumbnail?: string;
}

function HomePage() {
    const [pdfs, setPdfs] = useState<FileItem[]>([]);
    const [images, setImages] = useState<FileItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPdfs, setFilteredPdfs] = useState<FileItem[]>([]);
    const [filteredImages, setFilteredImages] = useState<FileItem[]>([]);
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
    const [pdfZoomLevel, setPdfZoomLevel] = useState<number>(1);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
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

    // Filter files based on search term
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredPdfs(pdfs);
            setFilteredImages(images);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredPdfs(pdfs.filter(pdf => pdf.name.toLowerCase().includes(term)));
            setFilteredImages(images.filter(image => image.name.toLowerCase().includes(term)));
        }
    }, [searchTerm, pdfs, images]);

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

    const items = [
        {
            key: '2',
            label: (
                <span>
          <PictureOutlined /> Images {filteredImages.length > 0 ? `(${filteredImages.length})` : ''}
        </span>
            ),
            children: renderFileList(filteredImages, PictureOutlined),
        },
        {
            key: '1',
            label: (
                <span>
          <FileOutlined /> PDFs {filteredPdfs.length > 0 ? `(${filteredPdfs.length})` : ''}
        </span>
            ),
            children: renderFileList(filteredPdfs, FileOutlined),
        },
    ];

    return (
        <Layout>
            <Header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <Button 
                            className="mobile-menu-button"
                            type="text" 
                            icon={<MenuOutlined />} 
                            onClick={() => setDrawerVisible(true)}
                        />
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                            <Title level={2} style={{ color: 'white', margin: '14px 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
                                Neyna
                            </Title>
                        </Link>
                    </div>
                    <div className="nav-controls desktop-nav">
                        <Link to="/advertise" className="contact-link">
                            <FileTextOutlined /> Advertise
                        </Link>
                        <Link to="/contact" className="contact-link">
                            <PhoneOutlined /> Contact
                        </Link>
                        <Link to="/terms" className="contact-link">
                            <FileTextOutlined /> Terms
                        </Link>
                        <Search
                            className="search-bar"
                            placeholder="Search files..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onSearch={(value) => setSearchTerm(value)}
                            enterButton={<SearchOutlined />}
                            allowClear
                        />
                    </div>
                    <Search
                        className="search-bar mobile-search"
                        placeholder="Search files..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={(value) => setSearchTerm(value)}
                        enterButton={<SearchOutlined />}
                        allowClear
                    />
                </div>
            </Header>

            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                className="mobile-nav-drawer"
                width={280}
            >
                <div className="mobile-nav-links">
                    <Link to="/advertise" className="mobile-nav-link" onClick={() => setDrawerVisible(false)}>
                        <FileTextOutlined /> Advertise
                    </Link>
                    <Link to="/contact" className="mobile-nav-link" onClick={() => setDrawerVisible(false)}>
                        <PhoneOutlined /> Contact
                    </Link>
                    <Link to="/terms" className="mobile-nav-link" onClick={() => setDrawerVisible(false)}>
                        <FileTextOutlined /> Terms
                    </Link>
                </div>
            </Drawer>
            <Content>
                <div className="content-wrapper">
                    <Tabs defaultActiveKey="2" items={items} size="middle" />
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/advertise" element={<Advertise />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
    );
}

export default App;