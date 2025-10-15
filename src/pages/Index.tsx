import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

interface Server {
  id: number;
  name: string;
  slots: number;
  version: string;
  mods: string;
  price: number;
  online: boolean;
  popular?: boolean;
}

const servers: Server[] = [
  { id: 1, name: 'Survival Pro', slots: 100, version: 'Spаm4', mods: 'Vanilla', price: 299, online: true, popular: true },
  { id: 2, name: 'Creative Build', slots: 50, version: 'Spаm4', mods: 'WorldEdit', price: 199, online: true },
  { id: 3, name: 'PvP Arena', slots: 200, version: 'Spаm3', mods: 'Combat+', price: 499, online: true },
  { id: 4, name: 'RPG Adventure', slots: 150, version: 'Spаm4', mods: 'RPG Pack', price: 399, online: false },
];

const Index = () => {
  const [selectedServer, setSelectedServer] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/5 via-transparent to-[#FF00FF]/5 pointer-events-none" />
      
      <div className="relative">
        <header className="border-b border-[#00D9FF]/20 bg-[#1A1A2E]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⛏️</div>
              <h1 className="text-2xl font-bold text-neon-green">MINECRAFT SERVERS</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#servers" className="text-white/80 hover:text-neon-cyan transition-colors">Серверы</a>
              <a href="#pricing" className="text-white/80 hover:text-neon-cyan transition-colors">Тарифы</a>
              <a href="#faq" className="text-white/80 hover:text-neon-cyan transition-colors">FAQ</a>
            </nav>
          </div>
        </header>

        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-[#00FF41] to-[#00D9FF] rounded-full mb-6 animate-glow-pulse">
              <span className="text-[#1A1A2E] font-bold text-sm">🔥 ЛУЧШИЕ СЕРВЕРЫ 2025</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#00FF41] via-[#00D9FF] to-[#FF00FF] bg-clip-text text-transparent">
              ТВОЙ МИР,<br />ТВОИ ПРАВИЛА
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Аренда игровых серверов Minecraft с мгновенным запуском, поддержкой модов и круглосуточной технической поддержкой
            </p>
            <Button className="bg-neon-green hover:bg-neon-green/80 text-[#1A1A2E] font-bold px-8 py-6 text-lg neon-glow-green">
              Выбрать сервер
              <Icon name="ArrowRight" className="ml-2" />
            </Button>
          </div>
        </section>

        <section id="servers" className="py-16 px-4">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-center mb-12 text-white">
              Доступные <span className="text-neon-magenta">серверы</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servers.map((server, index) => (
                <Card 
                  key={server.id} 
                  className={`bg-card border-2 hover:border-neon-cyan transition-all duration-300 cursor-pointer animate-fade-in ${
                    server.popular ? 'border-neon-green' : 'border-border'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedServer(server.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-neon-cyan">{server.name}</CardTitle>
                      {server.popular && (
                        <Badge className="bg-neon-green text-[#1A1A2E] border-0">ТОП</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${server.online ? 'bg-neon-green' : 'bg-red-500'} animate-glow-pulse`} />
                      {server.online ? 'Online' : 'Offline'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-white/70">
                      <Icon name="Users" size={16} className="text-neon-green" />
                      <span className="text-sm">Слоты: {server.slots}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Icon name="Package" size={16} className="text-neon-cyan" />
                      <span className="text-sm">Версия: {server.version}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Icon name="Wrench" size={16} className="text-neon-magenta" />
                      <span className="text-sm">{server.mods}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <span className="text-2xl font-bold text-neon-green">{server.price}₽</span>
                      <span className="text-white/50 text-sm">/мес</span>
                    </div>
                    <Button 
                      className="bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-[#1A1A2E] transition-all"
                      size="sm"
                    >
                      Rent
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 px-4 bg-black/20">
          <div className="container mx-auto">
            <h3 className="text-4xl font-bold text-center mb-12 text-white">
              Выбери свой <span className="text-neon-cyan">тариф</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-card border-2 border-border hover:border-neon-green transition-all">
                <CardHeader>
                  <div className="text-4xl mb-2">🌱</div>
                  <CardTitle className="text-2xl text-neon-green">Starter</CardTitle>
                  <CardDescription>Для начинающих</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-6">
                    199₽<span className="text-lg text-white/50">/мес</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-green" />
                      <span className="text-white/80">До 50 слотов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-green" />
                      <span className="text-white/80">2GB RAM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-green" />
                      <span className="text-white/80">10GB SSD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-green" />
                      <span className="text-white/80">Базовая поддержка</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-[#1A1A2E]">
                    Выбрать
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card border-2 border-neon-magenta hover:border-neon-magenta transition-all scale-105 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-magenta text-[#1A1A2E] px-4 py-1 rounded-full text-sm font-bold">
                  ПОПУЛЯРНЫЙ
                </div>
                <CardHeader>
                  <div className="text-4xl mb-2">⚡</div>
                  <CardTitle className="text-2xl text-neon-magenta">Pro</CardTitle>
                  <CardDescription>Для серьезной игры</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-6">
                    399₽<span className="text-lg text-white/50">/мес</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-magenta" />
                      <span className="text-white/80">До 150 слотов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-magenta" />
                      <span className="text-white/80">6GB RAM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-magenta" />
                      <span className="text-white/80">40GB SSD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-magenta" />
                      <span className="text-white/80">Приоритетная поддержка</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-magenta" />
                      <span className="text-white/80">Все моды</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-neon-magenta text-[#1A1A2E] hover:bg-neon-magenta/80 font-bold">
                    Выбрать
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card border-2 border-border hover:border-neon-cyan transition-all">
                <CardHeader>
                  <div className="text-4xl mb-2">👑</div>
                  <CardTitle className="text-2xl text-neon-cyan">Ultimate</CardTitle>
                  <CardDescription>Максимальная мощность</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-6">
                    799₽<span className="text-lg text-white/50">/мес</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-cyan" />
                      <span className="text-white/80">До 300 слотов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-cyan" />
                      <span className="text-white/80">16GB RAM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-cyan" />
                      <span className="text-white/80">100GB NVMe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-cyan" />
                      <span className="text-white/80">VIP поддержка 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-neon-cyan" />
                      <span className="text-white/80">DDoS защита</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-[#1A1A2E]">
                    Выбрать
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h3 className="text-4xl font-bold text-center mb-12 text-white">
              Частые <span className="text-neon-green">вопросы</span>
            </h3>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-neon-cyan">
                  Как быстро запускается сервер?
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  Сервер запускается автоматически в течение 2-3 минут после оплаты. Вы сразу получите доступ к панели управления и сможете начать игру.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-neon-cyan">
                  Можно ли установить свои моды?
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  Да! Вы получаете полный FTP доступ к серверу и можете устанавливать любые моды и плагины. Мы также предоставляем готовые сборки популярных модпаков.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-neon-cyan">
                  Что если мне не хватит мощности?
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  Вы можете в любой момент улучшить тариф через личный кабинет. Переход занимает несколько минут, данные сервера сохраняются полностью.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-neon-cyan">
                  Есть ли защита от DDoS атак?
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  Базовая защита включена во все тарифы. На тарифе Ultimate доступна расширенная защита с фильтрацией до 100 Гбит/с.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-white hover:text-neon-cyan">
                  Как подключиться к серверу?
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  После создания сервера вы получите IP-адрес и порт. Просто откройте Minecraft, нажмите "Multiplayer" → "Add Server" и введите полученные данные.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <footer className="border-t border-white/10 py-12 px-4 mt-20">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-3xl">⛏️</div>
              <span className="text-xl font-bold text-neon-green">MINECRAFT SERVERS</span>
            </div>
            <p className="text-white/50 mb-6">Лучшие игровые серверы для вашего мира</p>
            <div className="flex gap-6 justify-center mb-8">
              <a href="#" className="text-white/60 hover:text-neon-cyan transition-colors">
                <Icon name="MessageCircle" size={24} />
              </a>
              <a href="#" className="text-white/60 hover:text-neon-cyan transition-colors">
                <Icon name="Mail" size={24} />
              </a>
              <a href="#" className="text-white/60 hover:text-neon-cyan transition-colors">
                <Icon name="Globe" size={24} />
              </a>
            </div>
            <p className="text-white/40 text-sm">© 2025 Minecraft Servers. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
