import * as React from 'react';
import * as classNames from 'classnames';

export interface ItemProps {
  className?: string;
  onClick?: (e: any) => any;
}

export const SectionMenu: React.SFC<ItemProps> = ({ children }) => (
  <section className="block section-menu active">
    {children}
  </section>
);

export const SectionWrapper: React.SFC<ItemProps> = ({ children }) => (
  <div className="section-wrapper">
    {children}
  </div>
);

export const Content: React.SFC<ItemProps> = ({ className, children }) => (
  <div id="content" className={className}>
    {children}
  </div>
);

export const ContentStarred: React.SFC<ItemProps> = ({ className, children }) => (
  <Content className={classNames('starred', className)}>
    {children}
  </Content>
);

export const ContentSection: React.SFC<ItemProps> = ({ children }) => (
  <Content className="section">
    {children}
  </Content>
);

export const ContentProduct: React.SFC<ItemProps> = ({ children }) => (
  <Content className="product">
    {children}
  </Content>
);

export const MovieProduct: React.SFC<ItemProps> = ({ children }) => (
  <section className="block product movie">
    {children}
  </section>
);

export const PlayerWrapper: React.SFC<ItemProps> = ({ onClick }) => (
  <div className="block-product">
    <Scaffold>
      <div className="player-wrapper">
        <div className="react-play-button large" onClick={onClick}>
          <figure className="icon-content" />
        </div>
      </div>
    </Scaffold>
  </div>
);

export const Hero: React.SFC<ItemProps> = ({ children, className }) => (
  <section className={classNames('hero', className)}>
    {children}
  </section>
);

export const HeroWrapper: React.SFC<ItemProps> = ({ children }) => (
  <div className="hero-wrapper">
    {children}
  </div>
);

export const Scaffold: React.SFC<ItemProps> = ({ children, className }) => (
  <div className={classNames('scaffold', className)}>
    {children}
  </div>
);

export const CollectionHeader: React.SFC<ItemProps> = ({ children }) => (
  <header className="collection-header">
    {children}
  </header>
);

export const BlockCollection: React.SFC<ItemProps> = ({ className, children }) => (
  <section className={classNames('block collection', className)}>
    {children}
  </section>
);

export const HeaderButton: React.SFC<ItemProps> = ({ onClick, children }) => (
  <span onClick={onClick} className="see-all button">{children}</span>
);

export const ReactGrid: React.SFC<ItemProps> = ({ className, children }) => (
  <div className={classNames('react-grid', className)}>
    <span>
      {children}
    </span>
  </div>
);

export const Loader: React.SFC<{
  top?: string;
  container?: string;
  spinner?: string;
  bottom?: string;
}> = ({ top, container, spinner, bottom }) => {
  const searchSpinner = classNames('search-spinner load-spinner no-query', spinner);
  const spinnerContainer = classNames('spinner-container', container);

  const style = !top && !bottom
    ? { marginTop: `${(window.innerHeight / 2) - 66}px`, marginBottom: bottom }
    : { marginTop: top, marginBottom: bottom };

  return (
    <div className={searchSpinner} style={style}>
      <div className={spinnerContainer}>
        <div className="spinner-line line01" />
        <div className="spinner-line line02" />
        <div className="spinner-line line03" />
        <div className="spinner-line line04" />
        <div className="spinner-line line05" />
        <div className="spinner-line line06" />
        <div className="spinner-line line07" />
        <div className="spinner-line line08" />
        <div className="spinner-line line09" />
        <div className="spinner-line line10" />
        <div className="spinner-line line11" />
        <div className="spinner-line line12" />
      </div>
    </div>
  );
};