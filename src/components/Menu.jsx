import React, { useState, useRef, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

import upIcon from '../imgs/arrow-down.svg';
import downIcon from '../imgs/arrow-up.svg';
import '../styles/Menu.scss';

function Menu(props) {
  const { menuList } = props;
  const [currentMenu, setCurrentMenu] = useState(0);

  const [accordionMenuOpen, setAccordionMenuOpen] = useState(false);
  const accordionButtonRef = useRef(null);

  const [scrollY, setScrollY] = useState(0);
  const [isOpenRecent, setIsOpenRecent] = useState(false);

  const menuBarRef = useRef(null);
  const menuContentRef = useRef({});

  // 스크롤 시 아코디언 메뉴를 닫기 위해 useEffect 사용
  const handleFollow = () => {
    setScrollY(window.pageYOffset);
  };

  useEffect(() => {
    // console.log('ScrollY is ', scrollY);
    if (scrollY > 0 && !isOpenRecent) {
      accordionButtonRef.current.click();
      setIsOpenRecent(false);
    }
  }, [scrollY]);

  useEffect(() => {
    if (isOpenRecent) {
      setTimeout(() => {
        setIsOpenRecent(false);
      }, 500);
    }
  }, [isOpenRecent]);

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    // addEventListener 함수를 실행
    watch();
    return () => {
      // addEventListener 함수를 삭제
      window.removeEventListener('scroll', handleFollow);
    };
  });

  // 선택한 메뉴(target)를 중심으로 스크롤을 옮겨서 보이도록 하기 위한 함수
  function changeBarMenuScroll(idx) {
    const totalWidth = menuList.reduce(
      (acc, cur, idx) => acc + menuContentRef.current[idx].getBoundingClientRect().width,
      0,
    );
    const menuBarWidth = menuBarRef.current.getBoundingClientRect().width;
    const menuBarHalfWidth = menuBarWidth / 2;
    const targetAbsoluteLeft = menuList
      .slice(0, idx)
      .reduce(
        (acc, cur, idx) => acc + menuContentRef.current[idx].getBoundingClientRect().width,
        0,
      );
    let targetWidth = menuContentRef.current[idx].getBoundingClientRect().width;
    let targetMiddlePosition = targetAbsoluteLeft + targetWidth / 2;

    let scrollPosition = 0;

    // target의 위치가 bar menu의 중앙보다 작을 경우 스크롤을 가장 왼쪽으로 설정
    if (targetMiddlePosition <= menuBarHalfWidth) {
      scrollPosition = 0;
    }
    // (전체 width - target의 위치)가 bar menu width의 절반보다 작을 경우 스크롤을 가장 오른쪽으로 설정
    else if (totalWidth - targetMiddlePosition <= menuBarHalfWidth) {
      scrollPosition = totalWidth - menuBarHalfWidth;
    }
    // 나머지는 스크롤을 target의 가운데로 설정
    else {
      scrollPosition = targetMiddlePosition - menuBarHalfWidth;
    }
    menuBarRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  }

  // when menu clicked
  function onClickMenu(id) {
    setCurrentMenu(id);
  };

  // accordion menu button component
  function CustomToggle({ eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey);

    return (
      <div
        className="home-tab__accordion-button-container"
        onClick={() => {
          setAccordionMenuOpen((sortOpen) => !sortOpen);
          setIsOpenRecent(true);
        }}
      >
        <button type="button" onClick={decoratedOnClick} className="home-tab__accordion-button">
          {accordionMenuOpen ? (
            <img src={upIcon} alt="up-icon" />
          ) : (
            <img src={downIcon} alt="down-icon" />
          )}
        </button>
      </div>
    );
  }

  // grid menu inner component
  function GridMenuContent({ idx, content }) {
    return (
      <div
        className="home-tab__grid-block"
        onClick={() => {
          onClickMenu(idx);
          accordionButtonRef.current.click();
          changeBarMenuScroll(idx);
        }}
      >
        <div className={(currentMenu === idx ? 'active' : '') + ' home-tab__grid-inner'}>
          <div>{content}</div>
        </div>
      </div>
    );
  }

  // bar menu inner component
  function BarMenuContent({ idx, content }) {
    return (
      <li key={idx} className={currentMenu === idx ? 'active' : ''}>
        <div
          className='home-tab__menu-content'
          onClick={() => {
            onClickMenu(idx);
            accordionButtonRef.current.click();
            changeBarMenuScroll(idx);
          }}
          ref={(ref) => {
            menuContentRef.current = { ...menuContentRef.current, [idx]: ref };
          }}
        >
          {content}
        </div>
      </li>
    );
  }

  // dummy component to close accordion menu
  function AccordionMenuClose() {
    const decoratedOnClick = useAccordionToggle(999);

    return (
      <div
        ref={accordionButtonRef}
        onClick={() => {
          setAccordionMenuOpen(false);
          decoratedOnClick();
          setIsOpenRecent(false);
        }}
      ></div>
    );
  }

  return (
    <div className="home-tab">
      <div className="home-tab__accordion">
        <Accordion>
          <div className="home-tab__menu-bar">
            <ul className='home-tab__menu' ref={menuBarRef}>
              {menuList.map((menu, idx) => (
                <BarMenuContent idx={idx} content={menu} />
              ))}
            </ul>
            <CustomToggle eventKey="0"></CustomToggle>
            <AccordionMenuClose></AccordionMenuClose>
          </div>

          <Accordion.Collapse eventKey="0">
            <div className="home-tab__grid">
              {menuList.map((menu, idx) => (
                <GridMenuContent idx={idx} content={menu} />
              ))}
            </div>
          </Accordion.Collapse>
        </Accordion>
      </div>
    </div>
  ) ;
}

export default Menu;
