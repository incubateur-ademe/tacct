'use client';


import styles from "../(main)/(home)/home.module.scss";
import { DemarcheBloc } from "./(home)/DemarcheBloc";
import { HeroBloc } from "./(home)/HeroBloc";
import { HeroBlocMobile } from "./(home)/HeroBlocMobile";
import { PatchEtRessourcesBloc } from "./(home)/PatchEtRessourcesBloc";
import { TacctBloc } from "./(home)/TacctBloc";
import { TacctoscopeBloc } from "./(home)/TacctoscopeBloc";
import { VerbatimBloc } from "./(home)/VerbatimBloc";

const Home = () => {
  return (
    <div>
      <div className={styles.heroBlocDesktopOnly}><HeroBloc /></div>
      <div className={styles.heroBlocMobileOnly}><HeroBlocMobile /></div>
      <TacctoscopeBloc />
      <TacctBloc />
      <DemarcheBloc />
      <PatchEtRessourcesBloc />
      <VerbatimBloc />
    </div>
  );
};

export default Home;
