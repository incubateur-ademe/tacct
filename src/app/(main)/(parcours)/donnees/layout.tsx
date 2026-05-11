"use client";
import { MenuLateral } from '@/components/ui/MenuLateral';
import { MenuMobileDrawer } from '@/components/ui/MenuMobileDrawer';
import { Suspense, useState, type PropsWithChildren } from 'react';

const ExplorerTerritoireLayout = ({ children }: PropsWithChildren) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);

  return (
    <Suspense>
      <div className="flex min-h-screen">
        {/* Menu latéral fixe */}
        <div className="hidden nav:block">
          <MenuLateral isCollapsed={isMenuCollapsed} onToggleCollapse={setIsMenuCollapsed} />
        </div>
        {/* Contenu principal */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isMenuCollapsed ? 'nav:ml-[50px]' : 'nav:ml-[322px]'}`}>
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
      {/* Navigation mobile */}
      <div className="block nav:hidden">
        <MenuMobileDrawer />
      </div>
    </Suspense>
  );
};

export default ExplorerTerritoireLayout;
