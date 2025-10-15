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
}

interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
  display_order: number;
}

const AUTH_URL = 'https://functions.poehali.dev/57939455-bc01-4c35-80f2-ae3c5ae8c00b';
const NEWS_URL = 'https://functions.poehali.dev/338ace17-3dab-4601-bb7b-627b4fda416d';
const SOCIAL_URL = 'https://functions.poehali.dev/305f29bd-7d8d-4a52-83f6-164143e43a4a';

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
  const [newNews, setNewNews] = useState({ title: '', description: '', date: '' });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [newSocial, setNewSocial] = useState({ name: '', url: '', icon: 'Link', display_order: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
    fetchSocialLinks();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.is_admin);
      } catch (e) {
        console.error('Invalid token');
      }
    }
  }, [token]);

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
    navigator.clipboard.writeText('dayzm.my-craft.cc');
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
        setNewNews({ title: '', description: '', date: '' });
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
            <h1 className="text-5xl font-black text-white tracking-wider">DayZM</h1>
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
              <div className="inline-block bg-[#b4ff00] px-8 py-4 mb-6">
                <h2 className="text-2xl font-bold text-black">IP: dayzm.my-craft.cc.</h2>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={copyIP}
                  className="bg-[#c86400] hover:bg-[#a55300] text-white font-semibold px-6 py-6 text-lg"
                >
                  <Icon name="Copy" className="mr-2" size={20} />
                  {copied ? 'Скопировано!' : 'Скопировать IP'}
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
                  <h3 className="text-xl font-bold text-[#b4ff00]">Игроки онлайн</h3>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-white mb-2">0</div>
                  <div className="text-white/60">из 100</div>
                </div>
              </Card>

              <Card className="bg-[#3a3a3a]/90 border-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Globe" className="text-[#b4ff00]" size={28} />
                  <h3 className="text-xl font-bold text-[#b4ff00]">Версия</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-2">1.12.2</div>
                  <div className="text-white/60">Java Edition</div>
                </div>
              </Card>
            </div>

            <div className="bg-[#2a2a2a]/90 p-8 rounded-lg">
              <h3 className="text-3xl font-bold text-[#b4ff00] text-center mb-8">
                Новости сервера
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Card key={item.id} className="bg-[#3a3a3a]/60 border-2 border-[#b4ff00]/20 hover:border-[#b4ff00] transition-all p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-[#b4ff00] rounded-full flex items-center justify-center">
                        <span className="text-4xl">❓</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-white text-center mb-3">{item.title}</h4>
                    <p className="text-white/70 text-sm text-center">{item.description}</p>
                    <div className="text-center mt-4">
                      <span className="text-[#b4ff00] text-xs">{item.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-[#2a2a2a]/90 p-8 rounded-lg">
              <h3 className="text-3xl font-bold text-[#b4ff00] text-center mb-8">
                Что нужно для игры на проекте?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#3a3a3a]/60 p-6 rounded-lg border-2 border-transparent hover:border-[#b4ff00]/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#b4ff00] p-3 rounded">
                      <Icon name="Laptop" className="text-black" size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Любой лаунчер</h4>
                      <p className="text-white/70">
                        Используйте TLauncher, Minecraft Launcher или любой другой на выбор
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
                      <h4 className="text-xl font-bold text-white mb-2">Играй с телефона</h4>
                      <p className="text-white/70">
                        Поддерживаются Java лаунчеры для телефона: PojavLauncher и другие
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/90 p-8 rounded-lg">
              <h3 className="text-3xl font-bold text-[#b4ff00] text-center mb-8">
                Наши соцсети
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
        <DialogContent className="bg-[#2a2a2a] border-[#b4ff00] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Управление новостями</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-[#b4ff00] font-bold">Добавить новость</h3>
              <Input
                placeholder="Заголовок"
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
              />
              <Input
                placeholder="Описание"
                value={newNews.description}
                onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
              />
              <Input
                placeholder="Дата (например: 15 октября 2025)"
                value={newNews.date}
                onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                className="bg-[#3a3a3a] text-white border-[#b4ff00]/30"
              />
              <Button onClick={handleSaveNews} className="bg-[#b4ff00] hover:bg-[#9de000] text-black">
                Добавить
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-[#b4ff00] font-bold">Текущие новости</h3>
              {news.map((item) => (
                <div key={item.id} className="bg-[#3a3a3a] p-4 rounded space-y-2">
                  <Input
                    value={editingNews?.id === item.id ? editingNews.title : item.title}
                    onChange={(e) => setEditingNews({ ...item, title: e.target.value })}
                    className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                  />
                  <Input
                    value={editingNews?.id === item.id ? editingNews.description : item.description}
                    onChange={(e) => setEditingNews({ ...item, description: e.target.value })}
                    className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                  />
                  <Input
                    value={editingNews?.id === item.id ? editingNews.date : item.date}
                    onChange={(e) => setEditingNews({ ...item, date: e.target.value })}
                    className="bg-[#4a4a4a] text-white border-[#b4ff00]/30"
                  />
                  <div className="flex gap-2">
                    {editingNews?.id === item.id ? (
                      <Button onClick={handleSaveNews} size="sm" className="bg-[#b4ff00] text-black">
                        Сохранить
                      </Button>
                    ) : (
                      <Button onClick={() => setEditingNews(item)} size="sm" className="bg-[#b4ff00] text-black">
                        Редактировать
                      </Button>
                    )}
                    <Button onClick={() => handleDeleteNews(item.id)} size="sm" variant="destructive">
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#b4ff00]/30 pt-6 mt-6">
              <h3 className="text-[#b4ff00] font-bold mb-4">Управление соцсетями</h3>
              
              <div className="space-y-3 mb-4">
                <h4 className="text-white text-sm">Добавить соцсеть</h4>
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
                <h4 className="text-white text-sm">Текущие соцсети</h4>
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;