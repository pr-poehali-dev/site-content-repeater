import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [copied, setCopied] = useState(false);

  const mainTexts = {
    siteName: 'DayS',
    serverIP: 'dayS.my-craft.cc.',
    copyButtonText: 'Скопировать IP',
    copiedText: 'Скопировано!'
  };

  const serverInfo = {
    onlinePlayers: '0',
    maxPlayers: '100',
    playersTitle: 'Игроки онлайн',
    version: '1.12.2',
    versionSubtitle: 'Java Edition',
    versionTitle: 'Версия',
    newsTitle: 'Новости сервера'
  };

  const newsItems = [
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

  const requirementsTexts = {
    launcherSectionTitle: 'Наш лаунчер',
    launcherTitle: 'DayS Launcher',
    launcherDescription: 'Используйте наш собственный лаунчер для удобного подключения к серверу. Пока доступен только для ПК.',
    launcherButtonText: 'Скачать лаунчер',
    launcherComingSoon: 'Скоро будет доступен для скачивания'
  };

  const socialLinks = [
    { id: 1, name: 'Discord', url: 'https://discord.gg/example', icon: 'MessageCircle', display_order: 1 },
    { id: 2, name: 'VK', url: 'https://vk.com/example', icon: 'Users', display_order: 2 },
    { id: 3, name: 'YouTube', url: 'https://youtube.com/example', icon: 'Youtube', display_order: 3 }
  ];

  const footerTexts = {
    socialTitle: 'Наши соцсети',
    creatorLabel: 'Создатель проекта:',
    creatorName: 'Алан Габуния'
  };

  const copyIP = () => {
    navigator.clipboard.writeText(mainTexts.serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black">
      <div 
        className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920')" }}
      />

      <div className="relative">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="relative inline-block">
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#b4ff00] to-[#7cb800] drop-shadow-2xl animate-fade-in break-words">
                {mainTexts.siteName}
              </h1>
              <div className="absolute -inset-4 bg-[#b4ff00]/10 blur-3xl -z-10 rounded-full"></div>
            </div>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-delay break-words">
              Добро пожаловать на сервер выживания
            </p>

            <div className="space-y-6 animate-fade-in-delay-2">
              <div className="inline-block bg-[#b4ff00] px-4 md:px-8 py-3 md:py-4 mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-black break-words">IP: {mainTexts.serverIP}</h2>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={copyIP}
                  size="lg"
                  className="bg-[#b4ff00] hover:bg-[#9de600] text-black font-bold px-8 py-6 text-lg transition-all hover:scale-105"
                >
                  {copied ? mainTexts.copiedText : mainTexts.copyButtonText}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="bg-[#1a1a1a]/80 backdrop-blur-sm border-[#b4ff00]/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Users" className="text-[#b4ff00]" size={28} />
                  <h3 className="text-base md:text-xl font-bold text-[#b4ff00] break-words">{serverInfo.playersTitle}</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-black text-white mb-2">{serverInfo.onlinePlayers}</div>
                  <div className="text-sm md:text-base text-white/60">из {serverInfo.maxPlayers}</div>
                </div>
              </Card>

              <Card className="bg-[#1a1a1a]/80 backdrop-blur-sm border-[#b4ff00]/20 p-6">
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
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#2a2a2a]/90 p-4 md:p-8 rounded-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-[#b4ff00] text-center mb-6 md:mb-8 break-words">
                {serverInfo.newsTitle}
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
                {requirementsTexts.launcherSectionTitle}
              </h3>

              <Card className="bg-[#1a1a1a]/80 border-[#b4ff00]/20 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-[#b4ff00]/10 rounded-lg flex items-center justify-center">
                      <Icon name="Download" className="text-[#b4ff00]" size={48} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{requirementsTexts.launcherTitle}</h4>
                    <p className="text-sm md:text-base text-white/70 mb-4 break-words whitespace-pre-wrap">
                      {requirementsTexts.launcherDescription}
                    </p>
                    <Button
                      disabled
                      className="bg-[#b4ff00]/50 text-black font-bold cursor-not-allowed"
                    >
                      {requirementsTexts.launcherComingSoon}
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
                {footerTexts.socialTitle}
              </h3>

              <div className="flex flex-wrap gap-4 justify-center">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="bg-[#1a1a1a]/80 border-[#b4ff00]/20 p-6 hover:border-[#b4ff00] transition-all hover:scale-105">
                      <div className="flex flex-col items-center gap-3">
                        <Icon name={link.icon} className="text-[#b4ff00] group-hover:scale-110 transition-transform" size={32} />
                        <span className="text-white font-medium break-words">{link.name}</span>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 border-t border-[#b4ff00]/20 bg-[#0f0f0f]/80">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <p className="text-white/60 break-words">
              <span className="text-[#b4ff00]">{footerTexts.creatorLabel}</span> {footerTexts.creatorName}
            </p>
            <p className="text-white/40 text-xs md:text-sm max-w-4xl mx-auto">
              © 2025 {mainTexts.siteName}. Все права защищены.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
