import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

// Admin credentials stored in code
const ADMIN_CREDENTIALS = {
  email: 'admin@days.com',
  password: 'admin123'
};

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  image_url: string;
}

interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
  display_order: number;
}

interface Settings {
  siteName: string;
  serverIP: string;
  copyButtonText: string;
  copiedText: string;
  onlinePlayers: string;
  maxPlayers: string;
  playersTitle: string;
  version: string;
  versionSubtitle: string;
  versionTitle: string;
  newsTitle: string;
  launcherSectionTitle: string;
  launcherTitle: string;
  launcherDescription: string;
  launcherButtonText: string;
  launcherComingSoon: string;
  socialTitle: string;
  creatorLabel: string;
  creatorName: string;
}

const DEFAULT_SETTINGS: Settings = {
  siteName: 'DayS',
  serverIP: 'dayS.my-craft.cc.',
  copyButtonText: 'Скопировать IP',
  copiedText: 'Скопировано!',
  onlinePlayers: '0',
  maxPlayers: '100',
  playersTitle: 'Игроки онлайн',
  version: '1.12.2',
  versionSubtitle: 'Java Edition',
  versionTitle: 'Версия',
  newsTitle: 'Новости сервера',
  launcherSectionTitle: 'Наш лаунчер',
  launcherTitle: 'DayS Launcher',
  launcherDescription: 'Используйте наш собственный лаунчер для удобного подключения к серверу. Пока доступен только для ПК.',
  launcherButtonText: 'Скачать лаунчер',
  launcherComingSoon: 'Скоро будет доступен для скачивания',
  socialTitle: 'Наши соцсети',
  creatorLabel: 'Создатель проекта:',
  creatorName: 'Алан Габуния'
};

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Открытие сервера!',
    description: 'Рады объявить об открытии нашего сервера DayS! Присоединяйтесь к приключениям!',
    date: '2025-01-15',
    image_url: ''
  },
  {
    id: 2,
    title: 'Первое обновление',
    description: 'Добавлены новые возможности и исправлены ошибки. Играйте с комфортом!',
    date: '2025-01-20',
    image_url: ''
  }
];

const DEFAULT_SOCIAL: SocialLink[] = [
  { id: 1, name: 'Discord', url: 'https://discord.gg/example', icon: 'MessageCircle', display_order: 1 },
  { id: 2, name: 'VK', url: 'https://vk.com/example', icon: 'Users', display_order: 2 },
  { id: 3, name: 'YouTube', url: 'https://youtube.com/example', icon: 'Youtube', display_order: 3 }
];

const Index = () => {
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'news' | 'social' | 'settings'>('news');

  // Load data from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('days_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('days_news');
    return saved ? JSON.parse(saved) : DEFAULT_NEWS;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem('days_social');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL;
  });

  // Admin panel states
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    image_url: ''
  });

  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [newSocial, setNewSocial] = useState<Partial<SocialLink>>({
    name: '',
    url: '',
    icon: 'Link',
    display_order: socialLinks.length + 1
  });

  const [editingSettings, setEditingSettings] = useState<Settings>(settings);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('days_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('days_news', JSON.stringify(newsItems));
  }, [newsItems]);

  useEffect(() => {
    localStorage.setItem('days_social', JSON.stringify(socialLinks));
  }, [socialLinks]);

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('days_admin_token');
    if (adminToken === 'authenticated') {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === ADMIN_CREDENTIALS.email && adminPassword === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      localStorage.setItem('days_admin_token', 'authenticated');
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
      setLoginError('');
    } else {
      setLoginError('Неверный email или пароль');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('days_admin_token');
    setShowAdminPanel(false);
  };

  const copyIP = () => {
    navigator.clipboard.writeText(settings.serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // News management
  const handleAddNews = () => {
    if (newNews.title && newNews.description) {
      const newsItem: NewsItem = {
        id: Date.now(),
        title: newNews.title,
        description: newNews.description,
        date: newNews.date || new Date().toISOString().split('T')[0],
        image_url: newNews.image_url || ''
      };
      setNewsItems([...newsItems, newsItem]);
      setNewNews({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        image_url: ''
      });
    }
  };

  const handleUpdateNews = () => {
    if (editingNews) {
      setNewsItems(newsItems.map(item => 
        item.id === editingNews.id ? editingNews : item
      ));
      setEditingNews(null);
    }
  };

  const handleDeleteNews = (id: number) => {
    if (confirm('Удалить эту новость?')) {
      setNewsItems(newsItems.filter(item => item.id !== id));
    }
  };

  // Social links management
  const handleAddSocial = () => {
    if (newSocial.name && newSocial.url) {
      const socialLink: SocialLink = {
        id: Date.now(),
        name: newSocial.name,
        url: newSocial.url,
        icon: newSocial.icon || 'Link',
        display_order: newSocial.display_order || socialLinks.length + 1
      };
      setSocialLinks([...socialLinks, socialLink]);
      setNewSocial({
        name: '',
        url: '',
        icon: 'Link',
        display_order: socialLinks.length + 2
      });
    }
  };

  const handleUpdateSocial = () => {
    if (editingSocial) {
      setSocialLinks(socialLinks.map(item => 
        item.id === editingSocial.id ? editingSocial : item
      ));
      setEditingSocial(null);
    }
  };

  const handleDeleteSocial = (id: number) => {
    if (confirm('Удалить эту социальную ссылку?')) {
      setSocialLinks(socialLinks.filter(item => item.id !== id));
    }
  };

  // Settings management
  const handleSaveSettings = () => {
    setSettings(editingSettings);
    alert('Настройки сохранены!');
  };

  const handleResetSettings = () => {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      setSettings(DEFAULT_SETTINGS);
      setEditingSettings(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black">
      {/* Zombie apocalypse background */}
      <div 
        className="fixed inset-0 opacity-20 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=1920')",
          filter: 'grayscale(30%) contrast(120%)'
        }}
      />

      {/* Admin controls in top right */}
      {!showAdminPanel && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {!isAdmin ? (
            <Button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold"
              size="sm"
            >
              <Icon name="Settings" size={16} className="mr-1" />
              Админ
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setShowAdminPanel(true)}
                className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold"
                size="sm"
              >
                <Icon name="Settings" size={16} className="mr-1" />
                Панель
              </Button>
              <Button
                onClick={handleAdminLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                size="sm"
              >
                <Icon name="LogOut" size={16} className="mr-1" />
                Выйти
              </Button>
            </>
          )}
        </div>
      )}

      {/* Admin login modal */}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#b4ff00]">Вход администратора</h2>
              <Button
                onClick={() => {
                  setShowAdminLogin(false);
                  setLoginError('');
                }}
                variant="ghost"
                size="sm"
                className="text-white hover:text-[#b4ff00]"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">Email</label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                  placeholder="admin@days.com"
                  required
                />
              </div>
              <div>
                <label className="text-white text-sm mb-2 block">Пароль</label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm">{loginError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold"
              >
                Войти
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Admin panel */}
      {showAdminPanel && isAdmin && (
        <div className="fixed inset-0 bg-black/95 overflow-y-auto z-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#b4ff00]">Панель администратора</h1>
              <Button
                onClick={() => setShowAdminPanel(false)}
                variant="outline"
                className="border-[#b4ff00]/20 text-white hover:bg-[#b4ff00]/10"
              >
                <Icon name="X" size={20} className="mr-2" />
                Закрыть
              </Button>
            </div>

            {/* Admin tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <Button
                onClick={() => setActiveAdminTab('news')}
                className={activeAdminTab === 'news' ? 'bg-[#b4ff00] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}
              >
                <Icon name="Newspaper" size={16} className="mr-2" />
                Новости
              </Button>
              <Button
                onClick={() => setActiveAdminTab('social')}
                className={activeAdminTab === 'social' ? 'bg-[#b4ff00] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}
              >
                <Icon name="Share2" size={16} className="mr-2" />
                Соцсети
              </Button>
              <Button
                onClick={() => setActiveAdminTab('settings')}
                className={activeAdminTab === 'settings' ? 'bg-[#b4ff00] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}
              >
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
            </div>

            {/* News management */}
            {activeAdminTab === 'news' && (
              <div className="space-y-6">
                <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6">
                  <h2 className="text-xl font-bold text-[#b4ff00] mb-4">Добавить новость</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Заголовок</label>
                      <Input
                        value={newNews.title}
                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                        placeholder="Заголовок новости"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Описание</label>
                      <Textarea
                        value={newNews.description}
                        onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white min-h-[100px]"
                        placeholder="Описание новости"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Дата</label>
                      <Input
                        type="date"
                        value={newNews.date}
                        onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">URL изображения (необязательно)</label>
                      <Input
                        value={newNews.image_url}
                        onChange={(e) => setNewNews({ ...newNews, image_url: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <Button
                      onClick={handleAddNews}
                      className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить новость
                    </Button>
                  </div>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6">
                  <h2 className="text-xl font-bold text-[#b4ff00] mb-4">Существующие новости</h2>
                  <div className="space-y-4">
                    {newsItems.map((item) => (
                      <Card key={item.id} className="bg-[#2a2a2a] border-[#b4ff00]/10 p-4">
                        {editingNews?.id === item.id ? (
                          <div className="space-y-4">
                            <Input
                              value={editingNews.title}
                              onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                            />
                            <Textarea
                              value={editingNews.description}
                              onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white min-h-[80px]"
                            />
                            <Input
                              type="date"
                              value={editingNews.date}
                              onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                            />
                            <Input
                              value={editingNews.image_url}
                              onChange={(e) => setEditingNews({ ...editingNews, image_url: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                              placeholder="URL изображения"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleUpdateNews}
                                className="bg-[#b4ff00] hover:bg-[#9de600] text-black"
                                size="sm"
                              >
                                <Icon name="Save" size={16} className="mr-1" />
                                Сохранить
                              </Button>
                              <Button
                                onClick={() => setEditingNews(null)}
                                variant="outline"
                                className="border-[#b4ff00]/20 text-white"
                                size="sm"
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="text-white font-bold">{item.title}</h3>
                                <p className="text-white/70 text-sm mt-1">{item.description}</p>
                                <p className="text-[#b4ff00]/60 text-xs mt-2">{item.date}</p>
                                {item.image_url && (
                                  <p className="text-white/50 text-xs mt-1 truncate">Изображение: {item.image_url}</p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  onClick={() => setEditingNews(item)}
                                  variant="outline"
                                  className="border-[#b4ff00]/20 text-[#b4ff00] hover:bg-[#b4ff00]/10"
                                  size="sm"
                                >
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteNews(item.id)}
                                  variant="outline"
                                  className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                  size="sm"
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Social links management */}
            {activeAdminTab === 'social' && (
              <div className="space-y-6">
                <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6">
                  <h2 className="text-xl font-bold text-[#b4ff00] mb-4">Добавить социальную ссылку</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Название</label>
                      <Input
                        value={newSocial.name}
                        onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                        placeholder="Discord, VK, YouTube, и т.д."
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">URL</label>
                      <Input
                        value={newSocial.url}
                        onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Иконка (Lucide название)</label>
                      <Input
                        value={newSocial.icon}
                        onChange={(e) => setNewSocial({ ...newSocial, icon: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                        placeholder="MessageCircle, Users, Youtube, и т.д."
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Порядок отображения</label>
                      <Input
                        type="number"
                        value={newSocial.display_order}
                        onChange={(e) => setNewSocial({ ...newSocial, display_order: parseInt(e.target.value) })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <Button
                      onClick={handleAddSocial}
                      className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить ссылку
                    </Button>
                  </div>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6">
                  <h2 className="text-xl font-bold text-[#b4ff00] mb-4">Существующие ссылки</h2>
                  <div className="space-y-4">
                    {socialLinks.sort((a, b) => a.display_order - b.display_order).map((item) => (
                      <Card key={item.id} className="bg-[#2a2a2a] border-[#b4ff00]/10 p-4">
                        {editingSocial?.id === item.id ? (
                          <div className="space-y-4">
                            <Input
                              value={editingSocial.name}
                              onChange={(e) => setEditingSocial({ ...editingSocial, name: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                              placeholder="Название"
                            />
                            <Input
                              value={editingSocial.url}
                              onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                              placeholder="URL"
                            />
                            <Input
                              value={editingSocial.icon}
                              onChange={(e) => setEditingSocial({ ...editingSocial, icon: e.target.value })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                              placeholder="Иконка"
                            />
                            <Input
                              type="number"
                              value={editingSocial.display_order}
                              onChange={(e) => setEditingSocial({ ...editingSocial, display_order: parseInt(e.target.value) })}
                              className="bg-[#1a1a1a] border-[#b4ff00]/20 text-white"
                              placeholder="Порядок"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleUpdateSocial}
                                className="bg-[#b4ff00] hover:bg-[#9de600] text-black"
                                size="sm"
                              >
                                <Icon name="Save" size={16} className="mr-1" />
                                Сохранить
                              </Button>
                              <Button
                                onClick={() => setEditingSocial(null)}
                                variant="outline"
                                className="border-[#b4ff00]/20 text-white"
                                size="sm"
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3 flex-1">
                                <Icon name={item.icon as any} className="text-[#b4ff00]" size={24} />
                                <div>
                                  <h3 className="text-white font-bold">{item.name}</h3>
                                  <p className="text-white/70 text-sm truncate">{item.url}</p>
                                  <p className="text-white/50 text-xs">Порядок: {item.display_order}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  onClick={() => setEditingSocial(item)}
                                  variant="outline"
                                  className="border-[#b4ff00]/20 text-[#b4ff00] hover:bg-[#b4ff00]/10"
                                  size="sm"
                                >
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteSocial(item.id)}
                                  variant="outline"
                                  className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                  size="sm"
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Settings management */}
            {activeAdminTab === 'settings' && (
              <div className="space-y-6">
                <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6">
                  <h2 className="text-xl font-bold text-[#b4ff00] mb-4">Настройки сайта</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Название сайта</label>
                      <Input
                        value={editingSettings.siteName}
                        onChange={(e) => setEditingSettings({ ...editingSettings, siteName: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">IP сервера</label>
                      <Input
                        value={editingSettings.serverIP}
                        onChange={(e) => setEditingSettings({ ...editingSettings, serverIP: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Текст кнопки копирования</label>
                      <Input
                        value={editingSettings.copyButtonText}
                        onChange={(e) => setEditingSettings({ ...editingSettings, copyButtonText: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Текст после копирования</label>
                      <Input
                        value={editingSettings.copiedText}
                        onChange={(e) => setEditingSettings({ ...editingSettings, copiedText: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Игроки онлайн</label>
                      <Input
                        value={editingSettings.onlinePlayers}
                        onChange={(e) => setEditingSettings({ ...editingSettings, onlinePlayers: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Максимум игроков</label>
                      <Input
                        value={editingSettings.maxPlayers}
                        onChange={(e) => setEditingSettings({ ...editingSettings, maxPlayers: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Заголовок игроков</label>
                      <Input
                        value={editingSettings.playersTitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, playersTitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Версия</label>
                      <Input
                        value={editingSettings.version}
                        onChange={(e) => setEditingSettings({ ...editingSettings, version: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Подзаголовок версии</label>
                      <Input
                        value={editingSettings.versionSubtitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, versionSubtitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Заголовок версии</label>
                      <Input
                        value={editingSettings.versionTitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, versionTitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Заголовок новостей</label>
                      <Input
                        value={editingSettings.newsTitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, newsTitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Заголовок секции лаунчера</label>
                      <Input
                        value={editingSettings.launcherSectionTitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, launcherSectionTitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Название лаунчера</label>
                      <Input
                        value={editingSettings.launcherTitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, launcherTitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-white text-sm mb-2 block">Описание лаунчера</label>
                      <Textarea
                        value={editingSettings.launcherDescription}
                        onChange={(e) => setEditingSettings({ ...editingSettings, launcherDescription: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Текст кнопки лаунчера</label>
                      <Input
                        value={editingSettings.launcherButtonText}
                        onChange={(e) => setEditingSettings({ ...editingSettings, launcherButtonText: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Текст "Скоро"</label>
                      <Input
                        value={editingSettings.launcherComingSoon}
                        onChange={(e) => setEditingSettings({ ...editingSettings, launcherComingSoon: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Заголовок соцсетей</label>
                      <Input
                        value={editingSettings.socialTitle}
                        onChange={(e) => setEditingSettings({ ...editingSettings, socialTitle: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Текст "Создатель"</label>
                      <Input
                        value={editingSettings.creatorLabel}
                        onChange={(e) => setEditingSettings({ ...editingSettings, creatorLabel: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Имя создателя</label>
                      <Input
                        value={editingSettings.creatorName}
                        onChange={(e) => setEditingSettings({ ...editingSettings, creatorName: e.target.value })}
                        className="bg-[#2a2a2a] border-[#b4ff00]/20 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={handleSaveSettings}
                      className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold"
                    >
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить настройки
                    </Button>
                    <Button
                      onClick={handleResetSettings}
                      variant="outline"
                      className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                    >
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Сбросить к умолчанию
                    </Button>
                  </div>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#b4ff00]/20 p-6">
                  <h3 className="text-lg font-bold text-[#b4ff00] mb-2">Информация</h3>
                  <div className="text-white/70 text-sm space-y-2">
                    <p><strong>Email администратора:</strong> {ADMIN_CREDENTIALS.email}</p>
                    <p><strong>Пароль:</strong> {ADMIN_CREDENTIALS.password}</p>
                    <p className="text-white/50 text-xs mt-4">Все данные хранятся локально в браузере (localStorage). Для сброса всех данных очистите localStorage браузера.</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="relative inline-block">
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#b4ff00] to-[#7cb800] drop-shadow-2xl animate-fade-in break-words">
                {settings.siteName}
              </h1>
              <div className="absolute -inset-4 bg-[#b4ff00]/10 blur-3xl -z-10 rounded-full"></div>
            </div>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-delay break-words">
              Добро пожаловать на сервер выживания
            </p>

            <div className="space-y-6 animate-fade-in-delay-2">
              <div className="inline-block bg-[#b4ff00] px-4 md:px-8 py-3 md:py-4 mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-black break-words">IP: {settings.serverIP}</h2>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={copyIP}
                  size="lg"
                  className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold px-8 py-6 text-lg transition-all hover:scale-105"
                >
                  {copied ? settings.copiedText : settings.copyButtonText}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="bg-[#1a1a1a]/80 backdrop-blur-sm border-[#b4ff00]/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Users" className="text-[#b4ff00]" size={28} />
                  <h3 className="text-base md:text-xl font-bold text-[#b4ff00] break-words">{settings.playersTitle}</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-black text-white mb-2">{settings.onlinePlayers}</div>
                  <div className="text-sm md:text-base text-white/60">из {settings.maxPlayers}</div>
                </div>
              </Card>

              <Card className="bg-[#1a1a1a]/80 backdrop-blur-sm border-[#b4ff00]/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Globe" className="text-[#b4ff00]" size={28} />
                  <h3 className="text-base md:text-xl font-bold text-[#b4ff00] break-words">{settings.versionTitle}</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-black text-white mb-2 break-words">{settings.version}</div>
                  <div className="text-sm md:text-base text-white/60 break-words whitespace-pre-wrap">{settings.versionSubtitle}</div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-6 md:mb-8 break-words">
                {settings.newsTitle}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsItems.map((item) => (
                  <Card key={item.id} className="bg-[#1a1a1a]/80 border-[#b4ff00]/20 overflow-hidden hover:border-[#b4ff00]/40 transition-all">
                    {item.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 md:p-6">
                      <h4 className="text-base md:text-lg font-bold text-white text-center mb-2 md:mb-3 break-words">{item.title}</h4>
                      <p className="text-white/70 text-xs md:text-sm text-center break-words whitespace-pre-wrap">{item.description}</p>
                      <p className="text-[#b4ff00]/60 text-xs text-center mt-3">{item.date}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#0f0f0f]/50">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-4 md:mb-6 break-words">
                {settings.launcherSectionTitle}
              </h3>

              <Card className="bg-[#1a1a1a]/80 border-[#b4ff00]/20 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-[#b4ff00]/10 rounded-lg flex items-center justify-center">
                      <Icon name="Download" className="text-[#b4ff00]" size={48} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{settings.launcherTitle}</h4>
                    <p className="text-sm md:text-base text-white/70 mb-4 break-words whitespace-pre-wrap">
                      {settings.launcherDescription}
                    </p>
                    <Button
                      disabled
                      className="bg-[#b4ff00]/50 text-black font-bold cursor-not-allowed"
                    >
                      {settings.launcherComingSoon}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-6 md:mb-8 break-words">
                {settings.socialTitle}
              </h3>

              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.sort((a, b) => a.display_order - b.display_order).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="bg-[#1a1a1a]/80 border-[#b4ff00]/20 p-6 hover:border-[#b4ff00]/60 transition-all hover:scale-105">
                      <div className="flex flex-col items-center gap-3">
                        <Icon 
                          name={link.icon as any} 
                          className="text-[#b4ff00] group-hover:scale-110 transition-transform" 
                          size={32} 
                        />
                        <span className="text-white font-bold break-words">{link.name}</span>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 bg-[#0f0f0f]/80">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-white/60 text-sm break-words">
              {settings.creatorLabel} <span className="text-[#b4ff00] font-bold break-words">{settings.creatorName}</span>
            </p>
            <p className="text-white/40 text-xs mt-2">© 2025 {settings.siteName}. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
