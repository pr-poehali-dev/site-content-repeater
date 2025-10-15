import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText('dayzm.my-craft.cc');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1614465655168-f296bd310dcf?q=80&w=2000)',
          filter: 'blur(4px) brightness(0.4)'
        }}
      />
      
      <div className="relative z-10">
        <header className="bg-[#4a4a4a]/80 backdrop-blur-sm py-6 border-b border-white/10">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-black text-white text-center tracking-wider">DayZM</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-block bg-[#b4ff00] px-8 py-4 mb-6">
                <h2 className="text-2xl font-bold text-black">IP: dayzm.my-craft.cc</h2>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={copyIP}
                  className="bg-[#c86400] hover:bg-[#a55300] text-white font-semibold px-6 py-6 text-lg"
                >
                  <Icon name="Copy" className="mr-2" size={20} />
                  {copied ? 'Скопировано!' : 'Скопировать IP'}
                </Button>
                <Button 
                  className="bg-[#b4ff00] hover:bg-[#9de000] text-black font-semibold px-6 py-6 text-lg"
                >
                  <Icon name="Settings" className="mr-2" size={20} />
                  Админка
                </Button>
              </div>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
