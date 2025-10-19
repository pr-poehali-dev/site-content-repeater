import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  image_url?: string;
}

interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
  display_order: number;
}

interface PartnershipText {
  title: string;
  description: string;
  benefits: string[];
  requirements: string[];
  contact_text: string;
}

const AUTH_URL = 'https://functions.poehali.dev/57939455-bc01-4c35-80f2-ae3c5ae8c00b';
const NEWS_URL = 'https://functions.poehali.dev/338ace17-3dab-4601-bb7b-627b4fda416d';
const SOCIAL_URL = 'https://functions.poehali.dev/305f29bd-7d8d-4a52-83f6-164143e43a4a';
const SETTINGS_URL = 'https://functions.poehali.dev/b07d3580-0b77-4a87-9828-534a8da2ff5e';

const Index = () => {
  const [copied, setCopied] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState({ title: '', description: '', date: '', image_url: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [newSocial, setNewSocial] = useState({ name: '', url: '', icon: 'Link', display_order: 0 });
  const [adminTab, setAdminTab] = useState<'news' | 'social' | 'launcher' | 'partnership' | 'main' | 'server' | 'requirements' | 'footer'>('news');
  const [launcherFile, setLauncherFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [partnershipText, setPartnershipText] = useState<PartnershipText>({
    title: 'Стань партнёром проекта!',
    description: 'Мы приглашаем к сотрудничеству контент-мейкеров с YouTube, VK Видео и других платформ. Создавай контент о нашем сервере и получай уникальные преимущества!',
    benefits: [
      'Эксклюзивный контент для видео',
      'Особый статус на сервере',
      'Промокоды для твоей аудитории',
      'Поддержка от администрации'
    ],
    requirements: [
      'Активный канал/аккаунт',
      'Качественный контент',
      'Регулярные видео о сервере',
      'Позитивное отношение к проекту'
    ],
    contact_text: 'Заинтересовало предложение? Свяжись с администрацией в наших соцсетях!'
  });
  const [partnershipSectionTitle, setPartnershipSectionTitle] = useState('Партнёрская программа');
  const [mainTexts, setMainTexts] = useState({
    siteName: 'DayS',
    serverIP: 'dayS.my-craft.cc.',
    copyButtonText: 'Скопировать IP',
    copiedText: 'Скопировано!'
  });
  const [serverInfo, setServerInfo] = useState({
    onlinePlayers: '0',
    maxPlayers: '100',
    playersTitle: 'Игроки онлайн',
    version: '1.12.2',
    versionSubtitle: 'Java Edition',
    versionTitle: 'Версия',
    newsTitle: 'Новости сервера'
  });
  const [requirementsTexts, setRequirementsTexts] = useState({
    title: 'Что нужно для игры на проекте?',
    pcTitle: 'Любой лаунчер',
    pcDescription: 'Используйте TLauncher, Minecraft Launcher или любой другой на выбор',
    mobileTitle: 'Играй с телефона',
    mobileDescription: 'Поддерживаются Java лаунчеры для телефона: PojavLauncher и другие',
    launcherSectionTitle: 'Наш лаунчер',
    launcherTitle: 'DayS Launcher',
    launcherDescription: 'Используйте наш собственный лаунчер для удобного подключения к серверу. Пока доступен только для ПК.',
    launcherButtonText: 'Скачать лаунчер',
    launcherComingSoon: 'Скоро будет доступен для скачивания'
  });
  const [footerTexts, setFooterTexts] = useState({
    socialTitle: 'Наши соцсети',
    creatorLabel: 'Создатель проекта:',
    creatorName: 'Алан Габуния',
    disclaimer1: 'Администрация проекта не несет ответственности за действия игроков на сервере. Вся информация предоставляется "как есть". Играя на сервере, вы соглашаетесь с правилами проекта и принимаете на себя всю ответственность за свои действия.',
    disclaimer2: 'Проект является некоммерческим фанатским сервером и не связан с правообладателями DayZ или Minecraft. Все права на торговые марки принадлежат их владельцам. Проект не преследует коммерческих целей и создан исключительно для развлечения игроков. Администрация не несет ответственности за возможные претензии третьих лиц.'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
    fetchSocialLinks();
    loadSettings();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.is_admin);
      } catch (e) {
        console.error('Invalid token');
      }
    }
  }, [token]);

  const loadSettings = async () => {
    try {
      const res = await fetch(SETTINGS_URL);
      const data = await res.json();
      
      if (data.mainTexts) setMainTexts(data.mainTexts);
      if (data.serverInfo) setServerInfo(data.serverInfo);
      if (data.requirementsTexts) setRequirementsTexts(data.requirementsTexts);
      if (data.partnershipText) setPartnershipText(data.partnershipText);
      if (data.partnershipSectionTitle) setPartnershipSectionTitle(data.partnershipSectionTitle);
      if (data.footerTexts) setFooterTexts(data.footerTexts);
    } catch (error) {
      console.log('Настройки ещё не сохранены');
    }
  };

  const saveSettings = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(SETTINGS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({
          mainTexts,
          serverInfo,
          requirementsTexts,
          partnershipText,
          partnershipSectionTitle,
          footerTexts
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Ошибка сохранения');
      }
      
      toast({ title: 'Настройки сохранены!' });
    } catch (error) {
      console.error('Save settings error:', error);
      toast({ title: error instanceof Error ? error.message : 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch(NEWS_URL);
      const data = await res.json();
      setNews(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки новостей', variant: 'destructive' });
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const res = await fetch(SOCIAL_URL);
      const data = await res.json();
      setSocialLinks(data);
    } catch (error) {
      console.error('Ошибка загрузки соцсетей');
    }
  };

  const copyIP = () => {
    navigator.clipboard.writeText(mainTexts.serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuth = async () => {
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsAdmin(data.is_admin);
        setShowAuth(false);
        toast({ title: isLogin ? 'Вход выполнен' : 'Регистрация успешна' });
      } else {
        toast({ title: data.error || 'Ошибка', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка подключения', variant: 'destructive' });
    }
  };

  const handleSaveNews = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(NEWS_URL, {
        method: editingNews ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(editingNews ? { ...editingNews } : newNews)
      });
      
      if (res.ok) {
        fetchNews();
        setEditingNews(null);
        setNewNews({ title: '', description: '', date: '', image_url: '' });
        toast({ title: 'Новость сохранена' });
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!token) return;
    
    try {
      const res = await fetch(NEWS_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        fetchNews();
        toast({ title: 'Новость удалена' });
      }
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const handleSaveSocial = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(SOCIAL_URL, {
        method: editingSocial ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(editingSocial ? { ...editingSocial } : newSocial)
      });
      
      if (res.ok) {
        fetchSocialLinks();
        setEditingSocial(null);
        setNewSocial({ name: '', url: '', icon: 'Link', display_order: 0 });
        toast({ title: 'Ссылка сохранена' });
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleDeleteSocial = async (id: number) => {
    if (!token) return;
    
    try {
      const res = await fetch(SOCIAL_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        fetchSocialLinks();
        toast({ title: 'Ссылка удалена' });
      }
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/files/8c4af068-2738-4d1a-b8eb-62a3ed89f878.jpg)',
          filter: 'blur(2px) brightness(0.5)'
        }}
      />
      
      <div className="relative z-10">
        <header className="bg-[#4a4a4a]/80 backdrop-blur-sm py-6 border-b border-white/10">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-5xl font-black text-white tracking-wider">{mainTexts.siteName}</h1>
            {!token ? (
              <Button onClick={() => setShowAuth(true)} className="bg-[#b4ff00] hover:bg-[#9de000] text-black">
                Войти
              </Button>
            ) : (
              <div className="flex gap-2">
                {isAdmin && (
                  <Button onClick={() => setShowAdmin(true)} className="bg-[#b4ff00] hover:bg-[#9de000] text-black">
                    Админка
                  </Button>
                )}
                <Button onClick={logout} variant="outline" className="text-white border-white">
                  Выйти
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-block bg-[#b4ff00] px-4 md:px-8 py-3 md:py-4 mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-black break-words">IP: {mainTexts.serverIP}</h2>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={copyIP}
                  className="bg-[#c86400] hover:bg-[#a55300] text-white font-semibold px-6 py-6 text-lg"
                >
                  <Icon name="Copy" className="mr-2" size={20} />
                  {copied ? mainTexts.copiedText : mainTexts.copyButtonText}
                </Button>
              </div>

              {isAdmin && (
                <Card className="bg-red-600/90 border-0 p-4 mt-6 inline-block">
                  <div className="flex items-center gap-3">
                    <Icon name="Shield" className="text-white" size={24} />
                    <div className="text-left">
                      <div className="text-white font-bold text-sm">РЕЖИМ АДМИНА</div>
                      <div className="text-white/80 text-xs">Это окно видите только вы</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-[#3a3a3a]/90 border-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Users" className="text-[#b4ff00]" size={28} />
                  <h3 className="text-base md:text-xl font-bold text-[#b4ff00] break-words">{serverInfo.playersTitle}</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-black text-white mb-2">{serverInfo.onlinePlayers}</div>
                  <div className="text-sm md:text-base text-white/60">из {serverInfo.maxPlayers}</div>
                </div>
              </Card>

              <Card className="bg-[#3a3a3a]/90 border-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Globe" className="text-[#b4ff00]" size={28} />
                  <h3 className="text-base md:text-xl font-bold text-[#b4ff00] break-words">{serverInfo.versionTitle}</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-black text-white mb-2 break-words">{serverInfo.version}</div>
                  <div className="text-sm md:text-base text-white/60 break-words whitespace-pre-wrap">{serverInfo.versionSubtitle}</div>
                </div>
              </Card>
            </div>

            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-6 md:mb-8 break-words">
                {serverInfo.newsTitle}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Card key={item.id} className="bg-[#3a3a3a]/60 border-2 border-[#b4ff00]/20 hover:border-[#b4ff00] transition-all overflow-hidden">
                    {item.image_url ? (
                      <div className="w-full h-48 overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6">
                        <div className="w-16 h-16 bg-[#b4ff00] rounded-full flex items-center justify-center">
                          <Icon name="Newspaper" className="text-black" size={32} />
                        </div>
                      </div>
                    )}
                    <div className="p-4 md:p-6">
                      <h4 className="text-base md:text-lg font-bold text-white text-center mb-2 md:mb-3 break-words">{item.title}</h4>
                      <p className="text-white/70 text-xs md:text-sm text-center break-words whitespace-pre-wrap">{item.description}</p>
                      <div className="text-center mt-4">
                        <span className="text-[#b4ff00] text-xs">{item.date}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-6 md:mb-8 break-words">
                {requirementsTexts.title}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#3a3a3a]/60 p-6 rounded-lg border-2 border-transparent hover:border-[#b4ff00]/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#b4ff00] p-3 rounded">
                      <Icon name="Laptop" className="text-black" size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{requirementsTexts.pcTitle}</h4>
                      <p className="text-sm md:text-base text-white/70 break-words whitespace-pre-wrap">
                        {requirementsTexts.pcDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#3a3a3a]/60 p-6 rounded-lg border-2 border-transparent hover:border-[#b4ff00]/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#b4ff00] p-3 rounded">
                      <Icon name="Smartphone" className="text-black" size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{requirementsTexts.mobileTitle}</h4>
                      <p className="text-sm md:text-base text-white/70 break-words whitespace-pre-wrap">
                        {requirementsTexts.mobileDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-4 md:mb-6 break-words">
                {requirementsTexts.launcherSectionTitle}
              </h3>
              <div className="max-w-2xl mx-auto bg-[#3a3a3a]/60 p-6 rounded-lg border-2 border-[#b4ff00]/20">
                <div className="flex items-start gap-4">
                  <div className="bg-[#b4ff00] p-3 rounded">
                    <Icon name="Download" className="text-black" size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{requirementsTexts.launcherTitle}</h4>
                    <p className="text-sm md:text-base text-white/70 mb-4 break-words whitespace-pre-wrap">
                      {requirementsTexts.launcherDescription}
                    </p>
                    {launcherFile ? (
                      <a 
                        href={launcherFile} 
                        download
                        className="inline-flex items-center gap-2 bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold px-6 py-3 rounded-lg transition-all"
                      >
                        <Icon name="Download" size={20} />
                        {requirementsTexts.launcherButtonText}
                      </a>
                    ) : (
                      <div className="text-white/50 text-sm">{requirementsTexts.launcherComingSoon}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-4 md:mb-6 break-words">
                {partnershipSectionTitle}
              </h3>
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-[#b4ff00]/10 to-[#c86400]/10 p-6 rounded-lg border-2 border-[#b4ff00]/30">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#b4ff00] p-3 rounded">
                      <Icon name="Users" className="text-black" size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-3 break-words">{partnershipText.title}</h4>
                      <p className="text-sm md:text-base text-white/80 mb-4 break-words whitespace-pre-wrap">
                        {partnershipText.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#3a3a3a]/60 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Star" className="text-[#b4ff00]" size={20} />
                        <h5 className="text-white font-semibold">Что мы предлагаем:</h5>
                      </div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {partnershipText.benefits.map((benefit, index) => (
                          <li key={index} className="break-words whitespace-pre-wrap">• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-[#3a3a3a]/60 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="CheckCircle" className="text-[#b4ff00]" size={20} />
                        <h5 className="text-white font-semibold">Требования:</h5>
                      </div>
                      <ul className="text-white/70 text-sm space-y-1">
                        {partnershipText.requirements.map((req, index) => (
                          <li key={index} className="break-words whitespace-pre-wrap">• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white/60 text-sm mb-3 break-words whitespace-pre-wrap">
                      {partnershipText.contact_text}
                    </p>
                    <Button className="bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold px-8 py-6 text-lg">
                      <Icon name="MessageCircle" className="mr-2" size={20} />
                      Связаться с нами
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-6 md:mb-8 break-words">
                {footerTexts.socialTitle}
              </h3>
              
              <div className="flex gap-4 justify-center flex-wrap">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3a3a3a]/90 hover:bg-[#4a4a4a] border-2 border-[#b4ff00]/20 hover:border-[#b4ff00] p-4 rounded-lg transition-all flex items-center gap-3"
                  >
                    <Icon name={link.icon} className="text-[#b4ff00]" size={24} />
                    <span className="text-white font-semibold">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center py-6 space-y-4">
              <div className="inline-block bg-[#3a3a3a]/60 px-6 py-3 rounded-lg border border-[#b4ff00]/30">
                <p className="text-white/80 text-sm">
                  <span className="text-[#b4ff00] font-semibold">{footerTexts.creatorLabel}</span> {footerTexts.creatorName}
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto bg-[#2a2a2a]/60 px-6 py-4 rounded-lg border border-white/10">
                <p className="text-white/60 text-xs leading-relaxed break-words whitespace-pre-wrap">
                  {footerTexts.disclaimer1}
                </p>
                <p className="text-white/60 text-xs leading-relaxed mt-3 break-words whitespace-pre-wrap">
                  {footerTexts.disclaimer2}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="bg-[#2a2a2a] border-[#b4ff00]">
          <DialogHeader>
            <DialogTitle className="text-white">{isLogin ? 'Вход' : 'Регистрация'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
            />
            <Button onClick={handleAuth} className="w-full bg-[#b4ff00] hover:bg-[#9de000] text-black">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-[#b4ff00] text-sm hover:underline"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdmin} onOpenChange={setShowAdmin}>
        <DialogContent className="bg-[#2a2a2a] border-[#b4ff00] max-w-2xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-white">Админ-панель</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 border-b border-[#b4ff00]/30 pb-4 flex-wrap">
            <Button 
              onClick={() => setAdminTab('main')}
              className={adminTab === 'main' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Home" className="mr-2" size={18} />
              Главная
            </Button>
            <Button 
              onClick={() => setAdminTab('server')}
              className={adminTab === 'server' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Server" className="mr-2" size={18} />
              Сервер
            </Button>
            <Button 
              onClick={() => setAdminTab('news')}
              className={adminTab === 'news' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Newspaper" className="mr-2" size={18} />
              Новости
            </Button>
            <Button 
              onClick={() => setAdminTab('requirements')}
              className={adminTab === 'requirements' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Laptop" className="mr-2" size={18} />
              Требования
            </Button>
            <Button 
              onClick={() => setAdminTab('partnership')}
              className={adminTab === 'partnership' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Users" className="mr-2" size={18} />
              Партнёрство
            </Button>
            <Button 
              onClick={() => setAdminTab('social')}
              className={adminTab === 'social' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Share2" className="mr-2" size={18} />
              Соцсети
            </Button>
            <Button 
              onClick={() => setAdminTab('launcher')}
              className={adminTab === 'launcher' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="Download" className="mr-2" size={18} />
              Лаунчер
            </Button>
            <Button 
              onClick={() => setAdminTab('footer')}
              className={adminTab === 'footer' ? 'bg-[#b4ff00] text-black' : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
            >
              <Icon name="FileText" className="mr-2" size={18} />
              Футер
            </Button>
          </div>

          <div className="space-y-6">
            {adminTab === 'main' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[#b4ff00] font-bold">Главные тексты сайта</h3>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Название сайта</label>
                    <Input
                      value={mainTexts.siteName}
                      onChange={(e) => setMainTexts({ ...mainTexts, siteName: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">IP сервера</label>
                    <Input
                      value={mainTexts.serverIP}
                      onChange={(e) => setMainTexts({ ...mainTexts, serverIP: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Текст кнопки копирования</label>
                    <Input
                      value={mainTexts.copyButtonText}
                      onChange={(e) => setMainTexts({ ...mainTexts, copyButtonText: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Текст после копирования</label>
                    <Input
                      value={mainTexts.copiedText}
                      onChange={(e) => setMainTexts({ ...mainTexts, copiedText: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <Button onClick={saveSettings} className="w-full bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold">
                    <Icon name="Save" className="mr-2" size={18} />
                    Сохранить настройки
                  </Button>
                  
                  <div className="bg-[#3a3a3a]/60 p-4 rounded-lg border border-[#b4ff00]/20">
                    <p className="text-white/60 text-sm">
                      💡 Настройки сохраняются в базу данных и будут доступны после перезагрузки страницы
                    </p>
                  </div>
                </div>
              </>
            )}

            {adminTab === 'server' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[#b4ff00] font-bold">Информация о сервере</h3>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Заголовок "Игроки онлайн"</label>
                    <Input
                      value={serverInfo.playersTitle}
                      onChange={(e) => setServerInfo({ ...serverInfo, playersTitle: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Онлайн</label>
                      <Input
                        value={serverInfo.onlinePlayers}
                        onChange={(e) => setServerInfo({ ...serverInfo, onlinePlayers: e.target.value })}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Максимум</label>
                      <Input
                        value={serverInfo.maxPlayers}
                        onChange={(e) => setServerInfo({ ...serverInfo, maxPlayers: e.target.value })}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Заголовок "Версия"</label>
                    <Input
                      value={serverInfo.versionTitle}
                      onChange={(e) => setServerInfo({ ...serverInfo, versionTitle: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Версия игры</label>
                    <Input
                      value={serverInfo.version}
                      onChange={(e) => setServerInfo({ ...serverInfo, version: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Подзаголовок версии</label>
                    <Input
                      value={serverInfo.versionSubtitle}
                      onChange={(e) => setServerInfo({ ...serverInfo, versionSubtitle: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Заголовок секции новостей</label>
                    <Input
                      value={serverInfo.newsTitle}
                      onChange={(e) => setServerInfo({ ...serverInfo, newsTitle: e.target.value })}
                      className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                    />
                  </div>
                  
                  <Button onClick={saveSettings} className="w-full bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold">
                    <Icon name="Save" className="mr-2" size={18} />
                    Сохранить настройки
                  </Button>
                  
                  <div className="bg-[#3a3a3a]/60 p-4 rounded-lg border border-[#b4ff00]/20">
                    <p className="text-white/60 text-sm">
                      💡 Настройки сохраняются в базу данных и будут доступны после перезагрузки страницы
                    </p>
                  </div>
                </div>
              </>
            )}

            {adminTab === 'news' && (
              <>
                <div className="space-y-3">
                  <h3 className="text-[#b4ff00] font-bold">Добавить новость</h3>
              <Input
                placeholder="Заголовок"
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
              />
              <textarea
                placeholder="Описание новости"
                value={newNews.description}
                onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[80px]"
              />
              <Input
                placeholder="Дата (например: 15 октября 2025)"
                value={newNews.date}
                onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
              />
              
              <div className="bg-[#3a3a3a] p-4 rounded-lg border-2 border-dashed border-[#b4ff00]/30">
                <input
                  type="file"
                  id="news-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    setUploadingImage(true);
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                      const res = await fetch('https://cdn.poehali.dev/upload', {
                        method: 'POST',
                        body: formData
                      });
                      const data = await res.json();
                      
                      if (res.ok && data.url) {
                        setNewNews({ ...newNews, image_url: data.url });
                        toast({ title: 'Изображение загружено!' });
                      } else {
                        toast({ title: 'Ошибка загрузки', variant: 'destructive' });
                      }
                    } catch (error) {
                      toast({ title: 'Ошибка загрузки изображения', variant: 'destructive' });
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                />
                <label htmlFor="news-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Icon name="Image" className="text-[#b4ff00]" size={32} />
                  <p className="text-white text-sm">
                    {uploadingImage ? 'Загрузка...' : 'Загрузить изображение'}
                  </p>
                  {newNews.image_url && (
                    <img src={newNews.image_url} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />
                  )}
                </label>
              </div>
              
              <Button onClick={handleSaveNews} className="bg-[#b4ff00] hover:bg-[#9de000] text-black w-full">
                <Icon name="Plus" className="mr-2" size={18} />
                Добавить новость
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-[#b4ff00] font-bold">Текущие новости</h3>
              {news.map((item) => (
                <div key={item.id} className="bg-[#3a3a3a] p-4 rounded space-y-2">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded" />
                  )}
                  <Input
                    value={editingNews?.id === item.id ? editingNews.title : item.title}
                    onChange={(e) => setEditingNews({ ...item, title: e.target.value })}
                    className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                    placeholder="Заголовок"
                  />
                  <textarea
                    value={editingNews?.id === item.id ? editingNews.description : item.description}
                    onChange={(e) => setEditingNews({ ...item, description: e.target.value })}
                    className="w-full bg-[#4a4a4a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[60px]"
                    placeholder="Описание"
                  />
                  <Input
                    value={editingNews?.id === item.id ? editingNews.date : item.date}
                    onChange={(e) => setEditingNews({ ...item, date: e.target.value })}
                    className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                    placeholder="Дата"
                  />
                  
                  {editingNews?.id === item.id && (
                    <div className="bg-[#4a4a4a] p-3 rounded border border-[#b4ff00]/20">
                      <input
                        type="file"
                        id={`edit-image-${item.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setUploadingImage(true);
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            const res = await fetch('https://cdn.poehali.dev/upload', {
                              method: 'POST',
                              body: formData
                            });
                            const data = await res.json();
                            
                            if (res.ok && data.url) {
                              setEditingNews({ ...editingNews, image_url: data.url });
                              toast({ title: 'Изображение обновлено!' });
                            }
                          } catch (error) {
                            toast({ title: 'Ошибка загрузки', variant: 'destructive' });
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                      <label htmlFor={`edit-image-${item.id}`} className="cursor-pointer flex items-center gap-2 text-white text-sm">
                        <Icon name="Image" className="text-[#b4ff00]" size={20} />
                        {uploadingImage ? 'Загрузка...' : 'Изменить изображение'}
                      </label>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {editingNews?.id === item.id ? (
                      <>
                        <Button onClick={handleSaveNews} size="sm" className="bg-[#b4ff00] text-black flex-1">
                          <Icon name="Save" className="mr-2" size={16} />
                          Сохранить
                        </Button>
                        <Button onClick={() => setEditingNews(null)} size="sm" variant="outline" className="border-white text-white">
                          Отмена
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditingNews(item)} size="sm" className="bg-[#b4ff00] text-black flex-1">
                          <Icon name="Edit" className="mr-2" size={16} />
                          Редактировать
                        </Button>
                        <Button onClick={() => handleDeleteNews(item.id)} size="sm" variant="destructive">
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
              </>
            )}

            {adminTab === 'social' && (
              <>
                <div className="space-y-3">
                  <h3 className="text-[#b4ff00] font-bold">Добавить соцсеть</h3>
                <Input
                  placeholder="Название (например: Telegram)"
                  value={newSocial.name}
                  onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                  className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                />
                <Input
                  placeholder="Ссылка (например: https://t.me/username)"
                  value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                />
                <Input
                  placeholder="Иконка (MessageCircle, Youtube, Instagram)"
                  value={newSocial.icon}
                  onChange={(e) => setNewSocial({ ...newSocial, icon: e.target.value })}
                  className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                />
                <Button onClick={handleSaveSocial} className="bg-[#b4ff00] hover:bg-[#9de000] text-black">
                  Добавить соцсеть
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="text-[#b4ff00] font-bold">Текущие соцсети</h3>
                {socialLinks.map((link) => (
                  <div key={link.id} className="bg-[#3a3a3a] p-4 rounded space-y-2">
                    <Input
                      value={editingSocial?.id === link.id ? editingSocial.name : link.name}
                      onChange={(e) => setEditingSocial({ ...link, name: e.target.value })}
                      className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                      placeholder="Название"
                    />
                    <Input
                      value={editingSocial?.id === link.id ? editingSocial.url : link.url}
                      onChange={(e) => setEditingSocial({ ...link, url: e.target.value })}
                      className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                      placeholder="Ссылка"
                    />
                    <Input
                      value={editingSocial?.id === link.id ? editingSocial.icon : link.icon}
                      onChange={(e) => setEditingSocial({ ...link, icon: e.target.value })}
                      className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                      placeholder="Иконка"
                    />
                    <div className="flex gap-2">
                      {editingSocial?.id === link.id ? (
                        <Button onClick={handleSaveSocial} size="sm" className="bg-[#b4ff00] text-black">
                          Сохранить
                        </Button>
                      ) : (
                        <Button onClick={() => setEditingSocial(link)} size="sm" className="bg-[#b4ff00] text-black">
                          Редактировать
                        </Button>
                      )}
                      <Button onClick={() => handleDeleteSocial(link.id)} size="sm" variant="destructive">
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}

            {adminTab === 'launcher' && (
              <>
                <div className="space-y-3">
                  <h3 className="text-[#b4ff00] font-bold">Загрузить лаунчер</h3>
                  <p className="text-white/70 text-sm">Максимальный размер файла: 5 ГБ</p>
                  <div className="bg-[#3a3a3a] p-6 rounded-lg border-2 border-dashed border-[#b4ff00]/30 hover:border-[#b4ff00] transition-all">
                    <input
                      type="file"
                      id="launcher-upload"
                      className="hidden"
                      accept=".exe,.zip,.rar,.7z"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const maxSize = 5 * 1024 * 1024 * 1024;
                        if (file.size > maxSize) {
                          toast({ title: 'Файл слишком большой (макс. 5 ГБ)', variant: 'destructive' });
                          return;
                        }

                        setUploading(true);
                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                          const res = await fetch('https://cdn.poehali.dev/upload', {
                            method: 'POST',
                            body: formData
                          });
                          const data = await res.json();
                          
                          if (res.ok && data.url) {
                            setLauncherFile(data.url);
                            toast({ title: 'Лаунчер успешно загружен!' });
                          } else {
                            toast({ title: 'Ошибка загрузки', variant: 'destructive' });
                          }
                        } catch (error) {
                          toast({ title: 'Ошибка загрузки файла', variant: 'destructive' });
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                    <label htmlFor="launcher-upload" className="cursor-pointer flex flex-col items-center gap-3">
                      <Icon name="Upload" className="text-[#b4ff00]" size={48} />
                      <div className="text-center">
                        <p className="text-white font-semibold mb-1">
                          {uploading ? 'Загрузка...' : 'Нажмите для выбора файла'}
                        </p>
                        <p className="text-white/60 text-sm">
                          Поддерживаются: .exe, .zip, .rar, .7z
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {launcherFile && (
                    <div className="bg-[#3a3a3a] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name="CheckCircle" className="text-green-500" size={24} />
                          <div>
                            <p className="text-white font-semibold">Лаунчер загружен</p>
                            <p className="text-white/60 text-sm">Пользователи могут скачать файл</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setLauncherFile(null)} 
                          size="sm" 
                          variant="destructive"
                        >
                          Удалить
                        </Button>
                      </div>
                      <a 
                        href={launcherFile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#b4ff00] text-sm hover:underline mt-2 block"
                      >
                        {launcherFile}
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}

            {adminTab === 'requirements' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[#b4ff00] font-bold">Требования для игры</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Заголовок секции</label>
                      <Input
                        value={requirementsTexts.title}
                        onChange={(e) => setRequirementsTexts({ ...requirementsTexts, title: e.target.value })}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                    
                    <div className="bg-[#2a2a2a] p-4 rounded-lg space-y-3">
                      <h4 className="text-white font-semibold">Блок 1: ПК лаунчеры</h4>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Заголовок</label>
                        <Input
                          value={requirementsTexts.pcTitle}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, pcTitle: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Описание</label>
                        <textarea
                          value={requirementsTexts.pcDescription}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, pcDescription: e.target.value })}
                          className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[60px]"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-[#2a2a2a] p-4 rounded-lg space-y-3">
                      <h4 className="text-white font-semibold">Блок 2: Мобильные лаунчеры</h4>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Заголовок</label>
                        <Input
                          value={requirementsTexts.mobileTitle}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, mobileTitle: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Описание</label>
                        <textarea
                          value={requirementsTexts.mobileDescription}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, mobileDescription: e.target.value })}
                          className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[60px]"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-[#2a2a2a] p-4 rounded-lg space-y-3">
                      <h4 className="text-white font-semibold">Секция "Наш лаунчер"</h4>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Заголовок секции</label>
                        <Input
                          value={requirementsTexts.launcherSectionTitle}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, launcherSectionTitle: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Название лаунчера</label>
                        <Input
                          value={requirementsTexts.launcherTitle}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, launcherTitle: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Описание</label>
                        <textarea
                          value={requirementsTexts.launcherDescription}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, launcherDescription: e.target.value })}
                          className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[80px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Текст кнопки скачивания</label>
                        <Input
                          value={requirementsTexts.launcherButtonText}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, launcherButtonText: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Текст "скоро будет"</label>
                        <Input
                          value={requirementsTexts.launcherComingSoon}
                          onChange={(e) => setRequirementsTexts({ ...requirementsTexts, launcherComingSoon: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={saveSettings} className="w-full bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold">
                      <Icon name="Save" className="mr-2" size={18} />
                      Сохранить настройки
                    </Button>
                    
                    <div className="bg-[#3a3a3a]/60 p-4 rounded-lg border border-[#b4ff00]/20">
                      <p className="text-white/60 text-sm">
                        💡 Настройки сохраняются в базу данных и будут доступны после перезагрузки страницы
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {adminTab === 'partnership' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[#b4ff00] font-bold">Редактировать партнёрскую программу</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Заголовок секции</label>
                      <Input
                        value={partnershipSectionTitle}
                        onChange={(e) => setPartnershipSectionTitle(e.target.value)}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Заголовок карточки</label>
                      <Input
                        placeholder="Заголовок"
                        value={partnershipText.title}
                        onChange={(e) => setPartnershipText({ ...partnershipText, title: e.target.value })}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Описание</label>
                      <textarea
                        placeholder="Описание программы"
                        value={partnershipText.description}
                        onChange={(e) => setPartnershipText({ ...partnershipText, description: e.target.value })}
                        className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Преимущества (по одному на строку)</label>
                      <textarea
                        placeholder="Каждое преимущество с новой строки"
                        value={partnershipText.benefits.join('\n')}
                        onChange={(e) => setPartnershipText({ 
                          ...partnershipText, 
                          benefits: e.target.value.split('\n').filter(b => b.trim()) 
                        })}
                        className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Требования (по одному на строку)</label>
                      <textarea
                        placeholder="Каждое требование с новой строки"
                        value={partnershipText.requirements.join('\n')}
                        onChange={(e) => setPartnershipText({ 
                          ...partnershipText, 
                          requirements: e.target.value.split('\n').filter(r => r.trim()) 
                        })}
                        className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Текст для связи</label>
                      <Input
                        placeholder="Текст призыва к действию"
                        value={partnershipText.contact_text}
                        onChange={(e) => setPartnershipText({ ...partnershipText, contact_text: e.target.value })}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                    
                    <Button onClick={saveSettings} className="w-full bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold">
                      <Icon name="Save" className="mr-2" size={18} />
                      Сохранить настройки
                    </Button>
                    
                    <div className="bg-[#3a3a3a]/60 p-4 rounded-lg border border-[#b4ff00]/20">
                      <p className="text-white/60 text-sm">
                        💡 Настройки сохраняются в базу данных и будут доступны после перезагрузки страницы
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {adminTab === 'footer' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[#b4ff00] font-bold">Футер сайта</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Заголовок соцсетей</label>
                      <Input
                        value={footerTexts.socialTitle}
                        onChange={(e) => setFooterTexts({ ...footerTexts, socialTitle: e.target.value })}
                        className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                      />
                    </div>
                    
                    <div className="bg-[#2a2a2a] p-4 rounded-lg space-y-3">
                      <h4 className="text-white font-semibold">Информация о создателе</h4>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Метка "Создатель"</label>
                        <Input
                          value={footerTexts.creatorLabel}
                          onChange={(e) => setFooterTexts({ ...footerTexts, creatorLabel: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Имя создателя</label>
                        <Input
                          value={footerTexts.creatorName}
                          onChange={(e) => setFooterTexts({ ...footerTexts, creatorName: e.target.value })}
                          className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-[#2a2a2a] p-4 rounded-lg space-y-3">
                      <h4 className="text-white font-semibold">Дисклеймеры</h4>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Первый дисклеймер</label>
                        <textarea
                          value={footerTexts.disclaimer1}
                          onChange={(e) => setFooterTexts({ ...footerTexts, disclaimer1: e.target.value })}
                          className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-1 block">Второй дисклеймер</label>
                        <textarea
                          value={footerTexts.disclaimer2}
                          onChange={(e) => setFooterTexts({ ...footerTexts, disclaimer2: e.target.value })}
                          className="w-full bg-[#3a3a3a] text-white border border-[#b4ff00]/30 rounded-md p-3 min-h-[100px]"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={saveSettings} className="w-full bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold">
                      <Icon name="Save" className="mr-2" size={18} />
                      Сохранить настройки
                    </Button>
                    
                    <div className="bg-[#3a3a3a]/60 p-4 rounded-lg border border-[#b4ff00]/20">
                      <p className="text-white/60 text-sm">
                        💡 Настройки сохраняются в базу данных и будут доступны после перезагрузки страницы
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;