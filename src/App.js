import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import AccordionWrapper from './components/AccordionWrapper'; 
import AccordionItem from './components/AccordionItem';
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #ffd587;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: #000773;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const data1 = [
    {
      "title": "Why do you have two open seas?",
      "description": "We originally started our project on Polygon and after lots of requests, we decided to switch to Ethereum. As a result this required a new Open Sea."
    },
    {
      "title": "How will shares in the holding company work? Who will choose the start up?",
      "description": "Our team will shortlist companies that fall within our investment criteria and the community will vote on which to invest in."
    },
    {
      "title": "Whats your investment philosophy?",
      "description": "We are specifically focused on seed round artificial intelligence, sustainable agriculture and biotechnology start up. We believe these industries will rapidly grow over the next 20 years."
    },
    {
      "title": "Why is your trading volume low?",
      "description": "In order for our core utilities: The private mastermind, holding company & business coaching to be successful, we need to choose our NFT holders. This means making growth a lower priority and quality of NFT holders a higher priority."
    },
    {
      "title": "Why is the first 1000 NFTS sold whitelist only?",
      "description": "A skyscraper built on a shaky foundation will collapse”. The quality of our initial holders is crucial to the success of our utilities."
    },
    {
      "title": "How will you use your profits?",
      "description": "The team will take distributions and the rest will be reinvested back into making the project successful. We will reinvest back into marketing so our holders can sell at higher prices."
    },
    {
      "title": "What are the utilities?",
      "description": "Weekly business coaching with different members of the community. 2. Shares in a holding company. 3. Private mastermind. 4. $100K distributed to holders randomly at sell out."
    },
    {
      "title": "What is the long term vision?",
      "description": "Our goal is to make so our project has the #1 utility NFT."
    },
    {
      "title": "How likely is your success?",
      "description": "Nothing in life is certain except death, gravity and taxes. However, we will do whatever it takes to make this project successful. Even if that means pitching strangers on the street or doing door to door sales in wealthy neighborhoods."
    },
    {
      "title": "What makes you qualified for this project?",
      "description": "Our team member David sold 4000 NTFS with Enigma, our team member Dev has  helped scale various crypto projects, our team member Tristen built an 8 figure company and our team member Theo has raised millions of dollars for investment banks."
    },
    {
      "title": "Whats your marketing strategy?",
      "description": "For the first 1000 NFTs we will sell through 1 on 1 conversations and using a “sales funnel”.After 1000 NFTS have sold we will focus on building a fanatic community of 50,000 discord members (we currently have 12,000). We will also get influencers in the entrepreneurship space on instagram, youtube and podcasts to promote the project."
    },
    {
      "title": "When is your public mint available to anyone?",
      "description": "We will announce it after 1000 NFTs are sold."
    }
  ];

  return (

    <s.Screen>

    <div class="content__wrapper">
      <header class="header">
        <div class="container">
          <div class="row align-vertical-center header__row align-horisontal-between">
            <nav class="nav js-nav">
              <p class="nav__title">Menu</p>
              <button class="btn-close js-close-mobile-menu-btn" type="button">
                {/* <svg viewBox="0 0 14 14"  xmlns="http://www.w3.org/2000/svg">
                  <g >
                    <path d="M2.69 0H0V2.69H2.69V0Z" />
                    <path d="M5.41998 2.73001H2.72998V5.42001H5.41998V8.09001V8.11001H8.10998V10.78H10.8V8.09001H8.10998V5.42001V5.40001H5.41998V2.73001Z" fill="#FFD587"/>
                    <path d="M5.40997 8.10999H2.71997V10.8H5.40997V8.10999Z" />
                    <path d="M2.71002 10.81H0.0200195V13.5H2.71002V10.81Z" />
                    <path d="M13.52 10.81H10.83V13.5H13.52V10.81Z" />
                    <path d="M10.8 2.70999H8.10999V5.39999H10.8V2.70999Z"/>
                    <path d="M13.5001 0H10.8101V2.69H13.5001V0Z" />
                  </g>
                </svg> */}
              </button>
              <ul class="nav__list">
                <li class="nav__item"><a href="#story" class="nav__link js-smooth-scroll-link">Story</a></li>
                <li class="nav__item"><a href="#roadmap" class="nav__link js-smooth-scroll-link">Roadmap</a></li>
                <li class="nav__item"><a href="#collection" class="nav__link js-smooth-scroll-link">Collection</a></li>
                <li class="nav__item"><a href="#charity" class="nav__link js-smooth-scroll-link">Charity</a></li>
                <li class="nav__item"><a href="#team" class="nav__link js-smooth-scroll-link">Team</a></li>
              </ul>

            </nav>
            <button type="button" class="btn-hamburger js-open-mobile-menu-btn"></button>
          </div>
        </div>
      </header>
      <main class="main">
        <section class="sect__promo blend-overlay "   style={ { backgroundImage: "url('wp-content/uploads/2021/11/promo-bg.png')" } }>
          <div class="container">
            <div class="promo-block text-center">
              {/* <p class="date decor-title"> */}
                <div style={{ marginBottom: "4vw" }}>
                  <div>
                    {/* {data.totalSupply} / {CONFIG.MAX_SUPPLY} */}
                  </div>
                  <div>
                    {/* <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                      {//truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                    </StyledLink> */}
                  </div>
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <h3
                      >
                        The sale has ended.
                      </h3>
                      <h3
                      >
                        You can still find {CONFIG.NFT_NAME} on
                      </h3>
                      <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                        {CONFIG.MARKETPLACE}
                      </StyledLink>
                    </>
                  ) : (
                    <>
                      {/* <h3>
                        1 {//CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                        {CONFIG.NETWORK.SYMBOL}.
                      </h3> */}
                      {/* <h3>
                        Excluding gas fees.
                      </h3> */}
                      <br/>
                      {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                        <div>
                          <h3>
                            {/* Connect to the {CONFIG.NETWORK.NAME} network */}
                          </h3>
                          <a href="#" class="btn" rel="nofollow" target="_blank"
                            style = {{marginBottom: "7px", fontSize: "14px"}}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            MINT HERE</a>
                          {blockchain.errorMsg !== "" ? (
                            <>
                              <h3>
                                {blockchain.errorMsg}
                              </h3>
                            </>
                          ) : null}
                        </div>
                      ) : (
                        <>
                          {/* <h3 >
                            {feedback}
                          </h3> */}
                          <div style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "0.5vw"
                            }}  
                          >
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <h3 style={{ marginLeft: "2vw", marginRight: "2vw", fontSize: "3vw"}}>
                              {mintAmount}
                            </h3>
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </div>
                          <div>
                            <a href="#" class="btn" rel="nofollow" target="_blank" disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                            }}>
                              {claimingNft ? "BUSY" : "BUY"}
                            </a>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>


                {/* <span class="decor-title__text">Pre-Sale Sold Out! Next Launch: Dec 5th</span> */}
                {/* <span class="decor-title__corner decor-title__corner--left">
                  <svg viewBox="0 0 19 35" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M18.04 28.57H12.03V34.58H18.04V28.57Z" />
                      <path d="M6.01 0H0V6.01H6.01V0Z" />
                      <path d="M12.03 22.55H0V34.58H12.03V22.55Z" />
                    </g>
                  </svg>
                </span>
                <span class="decor-title__corner decor-title__corner--right">
                  <svg viewBox="0 0 19 35" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M18.04 28.57H12.03V34.58H18.04V28.57Z" />
                      <path d="M6.01 0H0V6.01H6.01V0Z" />
                      <path d="M12.03 22.55H0V34.58H12.03V22.55Z" />
                    </g>
                  </svg>
                </span>						 */}
              {/* </p> */}
              <h1 class="title">Own A Rare<br/> Inventor NFT</h1>
              <h2 class="subtitle">9200 famous inventors Inspiring the world with their creations</h2>
              {/* <div class="promo-btns">
                <a href="https://testnets.opensea.io/collection/inventor-club" class="btn" rel="nofollow" target="_blank">View On OpenSea</a>
                <a href="https://discord.gg/inventorclubnft" class="btn" rel="nofollow" target="_blank">Join Discord</a>
              </div> */}
            </div>
          </div>
          <div class="characters-slider js-characters-slider">
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T8.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T8.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T8.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T2.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T2.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T2.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T3.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T3.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T3.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T4.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T4.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T4.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T5.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T5.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T5.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T6.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T6.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T6.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T7.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T7.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T7.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T8.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T8.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T8.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T9.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T9.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T9.jpg" alt=""/></noscript></div></div>
            <div class="character-card"><div class="character-card__img"><img  alt="" data-src="https://inventorclub.io/wp-content/uploads/2021/11/T10.jpg" class="lazyload" src="https://inventorclub.io/wp-content/uploads/2021/11/T10.jpg"/><noscript><img src="https://inventorclub.io/wp-content/uploads/2021/11/T10.jpg" alt=""/></noscript></div></div>
          </div>
          <div class="js-bg-parallax promo-bg" data-parallax-direction="vertical-bottom" data-parallax-speed="0.15"></div>
        </section>
        <section class="sect__information">
          <div class="container">
            <div class="row align-horisontal-start row-gutters information-items__row">
                <div class="information-item__wrapper col-w-33">
                  <div class="information-item decor-corners">
                    <span class="information-item__count">01</span>
                    <p>9200 Famous<br/>Inventor NFTs</p>
                  </div>
                </div>
                <div class="information-item__wrapper col-w-33">
                  <div class="information-item decor-corners">
                    <span class="information-item__count">02</span>
                    <p>Featuring:<br/> Jeff Bezos, Elon Musk, Benjamin Franklin, Albert Einstein, Thomas Edison & More!</p>
                  </div>
                </div>
                <div class="information-item__wrapper col-w-33">
                  <div class="information-item decor-corners">
                    <span class="information-item__count">03</span>
                    <p>Each NFT eventually gives the owner exclusive rights to sell their own NFTS on our future marketplace.</p>
                  </div>
                </div>
            </div>
          </div>
          <svg viewBox="0 0 188 88"  xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__top"> 
            <g >
              <path d="M187.24 43.79H143.45V87.58H187.24V43.79Z" />
              <path d="M43.79 43.79H0V87.58H43.79V43.79Z" />
              <path d="M143.44 0H99.65V43.79H143.44V0Z" />
            </g>
          </svg>
          <svg viewBox="0 0 188 88" xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__bottom">
            <g>
              <path d="M43.79 0H0V43.79H43.79V0Z" />
              <path d="M187.24 0H143.45V43.79H187.24V0Z" />
              <path d="M87.58 43.79H43.79V87.58H87.58V43.79Z"/>
            </g>
          </svg>
        </section>
        <section class="sect__story gutters  gradient-bg" id="story">
          <div class="container">
            <div class="story">
              <div class="row align-vertical-center align-horisontal-between story__row row-norwap">
                <div class="story-text__col">
                  <h2 class="sect-title js-typing-text" >The Story</h2>
                  <div class="content">
                    <p>In pursuit of greater prosperity, Earth’s Chief Simulation Officer created 9,200 famous inventors responsible for making the world a better place. Only these inventors have the courage, creativity & grit to turn their ideas into inventions. A sense of purpose is everywhere in our discord. The Inventor’s Club is a collection of 9,200 AI-generated collectibles enhancing the Ethereum Blockchain.</p>
                    <p>&nbsp;</p>
                    <p><a href="https://drive.google.com/file/d/1-09aUc3sO0Ld8VbNFFyYPJJXxnmozBdm/view?usp=sharing"><strong>READ OUR WHITEPAPER HERE</strong></a></p>
                  </div>
                </div>
                  <div class="story-slider__col">
                    <div class="row align-vertical-end  story-slider__row">
                      <div class="story-slider__main js-story-slider">
                        <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T11.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T11.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T11.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T12.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T12.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T12.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T13.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T13.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T13.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T14.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T14.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T14.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T15.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T15.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T15.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T16.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T16.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T16.jpg" alt=""/></noscript></noscript></div></div>
                      </div>
                      <div class="story-slider__thumbnails js-story-slider-thumbnails">
                        <div class="character-card character-card__sm"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T11.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T11.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T11.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card character-card__sm"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T12.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T12.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T12.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card character-card__sm"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T13.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T13.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T13.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card character-card__sm"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T14.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T14.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T14.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card character-card__sm"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T15.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T15.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T15.jpg" alt=""/></noscript></noscript></div></div>
                        <div class="character-card character-card__sm"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T16.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img  alt="" data-src="wp-content/uploads/2021/11/T16.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T16.jpg" alt=""/></noscript></noscript></div></div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <svg viewBox="0 0 188 88" xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__bottom">
            <g>
              <path d="M43.79 0H0V43.79H43.79V0Z" />
              <path d="M187.24 0H143.45V43.79H187.24V0Z" />
              <path d="M87.58 43.79H43.79V87.58H87.58V43.79Z"/>
            </g>
          </svg>
          <div class="stars-sky js-bg-parallax" data-parallax-direction="vertical-top" data-parallax-speed="0.1"></div>
        </section>
        <section class="sect__roadmap gutter-top" id="roadmap" style={ { backgroundImage: "url('wp-content/uploads/2021/11/frame-bg.svg')" } }>  
          <h2 class="sect-title js-typing-text container text-center">The Road Map</h2>
          <div class="container">
            <div class="roadmap">
              <div class="roadmap-stage decor-corners">
                <h3 class="roadmap-stage__title">Pre-Mint Launch:</h3>
                <ul class="roadmap-stage__list">
                  <li class="roadmap-stage__list--item">Community Building</li>
                  <li class="roadmap-stage__list--item">Hype Generation</li>
                  <li class="roadmap-stage__list--item">Facebook ads, Mass IG/Discord bots, Giveaway, Youtube sponsorships,<br/> banner ads on Crypto sites, performance crypto marketing agency</li>
                  <li class="roadmap-stage__list--item">Charity Fund</li>
                  <li class="roadmap-stage__list--item">Top Tier Team Building</li>
                </ul>
              </div>
              <div class="roadmap-stage__divider"></div>
              <div class="roadmap-stage decor-corners">
                <h3 class="roadmap-stage__title">Mint:</h3>
                <ul class="roadmap-stage__list roadmap-stage__list--percentage">
                  <li class="roadmap-stage__list--percentage_value"><span data-from="0">25</span>%</li>
                  <li class="roadmap-stage__list--item">10 ethereum given away to community members</li>
                  <li class="roadmap-stage__list--item">50 free NFTs given to community</li>
                </ul>
                <ul class="roadmap-stage__list roadmap-stage__list--percentage">
                  <li class="roadmap-stage__list--percentage_value"><span data-from="0">50</span>%</li>
                  <li class="roadmap-stage__list--item">30 ETH given to community</li>
                  <li class="roadmap-stage__list--item">Marketing Launch Phase 2</li>
                </ul>
                <ul class="roadmap-stage__list roadmap-stage__list--percentage">
                  <li class="roadmap-stage__list--percentage_value"><span data-from="0">75</span>%</li>
                  <li class="roadmap-stage__list--item">50 ETH given to community</li>
                  <li class="roadmap-stage__list--item">$10K donated to a start up of the community’s choosing</li>
                </ul>
                <ul class="roadmap-stage__list roadmap-stage__list--percentage">
                  <li class="roadmap-stage__list--percentage_value"><span data-from="0">90</span>%</li>
                  <li class="roadmap-stage__list--item">100 ETH held for marketing</li>
                  <li class="roadmap-stage__list--item">30 ETH invested into entrepreneurs with great ideas</li>
                  <li class="roadmap-stage__list--item">$100K put into marketing for resellers</li>
                </ul>
              </div>
              <div class="roadmap-stage__divider"></div>
              <div class="roadmap-stage decor-corners">
              <h3 class="roadmap-stage__title">The Mission Begins</h3>
                <ul class="roadmap-stage__list">
                  <li class="roadmap-stage__list--item">The mission map is released</li>
                  <li class="roadmap-stage__list--item">Marketplace development begins</li>
                  <li class="roadmap-stage__list--item">Companion NFTs are released</li>
                  <li class="roadmap-stage__list--item">Marketing push 2 begins</li>
                </ul>
              </div>
              <div class="roadmap-stage__divider"></div>
            <div class="roadmap-stage decor-corners">
              <h3 class="roadmap-stage__title">2022 & Beyond</h3>
              <ul class="roadmap-stage__list">
                <li class="roadmap-stage__list--item">Brand sponsorships</li>
                <li class="roadmap-stage__list--item">Marketplace release</li>
                <li class="roadmap-stage__list--item">Introduction of “digital patent NFTS”</li>
                <li class="roadmap-stage__list--item">Profit reinvested in hiring top talent, new NFTS,<br/> a marketplace, and next level marketing.</li>
              </ul>
            </div>
                <div class="roadmap-stage__divider"></div>
            </div>
          </div>
          <svg viewBox="0 0 188 88"  xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__top"> 
            <g >
              <path d="M187.24 43.79H143.45V87.58H187.24V43.79Z" />
              <path d="M43.79 43.79H0V87.58H43.79V43.79Z" />
              <path d="M143.44 0H99.65V43.79H143.44V0Z" />
            </g>
          </svg>
          <svg viewBox="0 0 188 88" xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__bottom">
            <g>
              <path d="M43.79 0H0V43.79H43.79V0Z" />
              <path d="M187.24 0H143.45V43.79H187.24V0Z" />
              <path d="M87.58 43.79H43.79V87.58H87.58V43.79Z"/>
            </g>
          </svg>			
        </section>

        <section class="sect__collection gutter-top gradient-bg blend-overlay" id="collection">
          <h2 class="sect-title js-typing-text container text-center">Featured Collection</h2>
          <div class="container">
            <div class="collection">
              <div class="row align-horisontal-start collection-items__row">
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T27.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T27.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T28.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T28.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T29.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T29.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T30.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T30.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T31.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T31.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T32.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T32.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T33.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T33.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T34.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T34.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T35.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T35.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T36.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T36.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T37.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T37.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T38.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T38.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T39.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T39.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T40.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T40.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T41.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T41.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T42.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T42.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T43.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T43.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T44.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T44.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T45.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T45.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T46.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T46.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T47.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T47.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T48.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T48.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T49.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T49.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T50.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T50.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T51.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T51.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T52.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T52.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T53.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T53.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T54.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T54.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T55.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T55.jpg" alt=""/></noscript></div></div>
                  <div class="collection-item__wrapper"><div class="collection-item"><img  alt="" data-src="wp-content/uploads/2021/11/T56.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T56.jpg" alt=""/></noscript></div></div>
              </div>
            </div>
          </div>
          <div class="stars-sky js-bg-parallax" data-parallax-direction="vertical-bottom" data-parallax-speed="0.15"></div>
          <svg viewBox="0 0 188 88"  xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__top"> 
            <g >
              <path d="M187.24 43.79H143.45V87.58H187.24V43.79Z" />
              <path d="M43.79 43.79H0V87.58H43.79V43.79Z" />
              <path d="M143.44 0H99.65V43.79H143.44V0Z" />
            </g>
          </svg>
        </section>

        <section class="sect__charity gutters blend-overlay bg" id="charity" style={ { backgroundImage: "url('wp-content/uploads/2021/11/lab-bg.png')" } }>
          <div class="container">
            <div class="charity">
              <div class="row align-vertical-center align-horisontal-between row-nowrap charity__row">
                              <div class="charity__img">
                    <img  alt="" data-src="wp-content/uploads/2021/11/idea.svg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/idea.svg" alt=""/></noscript>
                  </div>
                            <div class="charity__text">
                  <h2 class="sect-title js-typing-text">Utility</h2>
                                  <h3 class="sect-subtitle">Contributing To<br/> Humanity’s Progress</h3>
                  <div class="content">
                    <p>✅ 9,200 inventors with 13 different base characters, 18 different backgrounds, 13 different clothing items, 12 different inventions, and 6 skin colors.</p>
                    <p>✅$400K invested into seed round artificial intelligence, sustainable agriculture & biotechnology companies in 2022. Our community will research and vote on which companies to invest in. These startups will be put into a holding company and our community will receive shares. NFT holders will receive a larger amount of shares in proportion to NFT ownership.</p>
                    <p>✅$100K given away to holders at sell out.</p>
                    <p>✅ Private mastermind with big names in entrepreneurship, crypto and start-up world.</p>
                    <p>&nbsp;</p>
                    <p><a href="https://drive.google.com/file/d/1-09aUc3sO0Ld8VbNFFyYPJJXxnmozBdm/view?usp=sharing"><strong>READ OUR WHITEPAPER HERE</strong></a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg viewBox="0 0 132 88"  xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__top">
            <g>
              <path d="M131.49 0H87.7V43.79H131.49V0Z" />
              <path d="M0 43.79V87.58H43.79H87.58V43.79H43.79H0Z" />
            </g>
          </svg>
          <svg viewBox="0 0 132 88"  xmlns="http://www.w3.org/2000/svg" class="cube-corners-svg cube-corners-svg__bottom">
            <g >
              <path d="M43.79 43.79H0V87.58H43.79V43.79Z"/>
              <path d="M131.5 0H87.7H43.91V43.79H87.7H131.5V0Z" />
            </g>
          </svg>
        </section>
        <section class="sect__team padding-b-50 gradient-bg gutter-top blend-overlay" id="team">
          <h2 class="sect-title js-typing-text container text-center">Leadership Team</h2>
          <div class="team">
            <div class="container">
              <div class="row align-horisontal-center team-members__row">
                <div class="team-member__wrapper col-w-33 gutter-bottom">
                  <div class="team-member">
                    <div class="team-member__top text-center">
                      <div class="team-member__top--content">
                        <div class="team-member__photo ">
                          <img  alt="Tristen Larsen" data-src="wp-content/uploads/2021/11/1.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/1.jpg" alt="Tristen Larsen"/></noscript>
                        </div>
                        <h3 class="team-member__name">Tristen Larsen</h3>
                        <p class="team-member__position">Founder</p>
                      </div>
                    </div>
                    <div class="team-member__bottom">
                      <p>Tristen is best known for reading 15 books a month recommended by billionaires. Tristen built an 8 figure company by age 23 and did it primarily with his marketing agency. Tristen reads half a book a day, works 16 hours a day, loves chess and beautiful views. Tristen is a workaholic obsessed with learning, creating and building companies. This project is meaningful to him because he deeply admires all inventors featured in this collection. Tristen is a liberatarian who is bullish on individual freedom and taking power from centralized organizations.</p>
                    </div>
                  </div>
                </div>
                
                <div class="team-member__wrapper col-w-33 gutter-bottom">
                  <div class="team-member">
                    <div class="team-member__top text-center">
                      <div class="team-member__top--content">
                        <div class="team-member__photo ">
                          <img  alt="Dev Motlani" data-src="wp-content/uploads/2021/11/2.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/2.jpg" alt="Dev Motlani"/></noscript>
                        </div>
                        <h3 class="team-member__name">Dev Motlani</h3>
                        <p class="team-member__position">CMO</p>
                      </div>
                    </div>
                    <div class="team-member__bottom">
                      <p>Dev moved from india to Dubai after scaling some of the biggest Crypto projects. Dev has connections with 880+ crypto publications. 250+ crypto based display ad channels. 100+ crypto youtubers, 2000 groups on telegrams & discord.</p>
                    </div>
                  </div>
                </div>

                <div class="team-member__wrapper col-w-33 gutter-bottom">
                  <div class="team-member">
                    <div class="team-member__top text-center">
                      <div class="team-member__top--content">
                        <div class="team-member__photo ">
                          <img  alt="Hugo Orellana" data-src="wp-content/uploads/2021/11/3.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/3.png" alt="Hugo Orellana"/></noscript>
                        </div>
                        <h3 class="team-member__name">Hugo Orellana</h3>
                        <p class="team-member__position">CAO</p>
                      </div>
                    </div>
                    <div class="team-member__bottom">
                      <p>Hugo is an inventor & extremely talented artist. After being responsible for designing the art for over 50 NFT projects, Hugo knows how to create an NFT that sells.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="join-club">
            <div class="container">
              <div class="join-club__block">
                <h2 class="join-club__title decor-title">
                  <span class="join-club__title--text decor-title__text js-typing-text">Join The Club</span>
                  <span class="decor-title__corner decor-title__corner--left">
                    <svg viewBox="0 0 19 35" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path d="M18.04 28.57H12.03V34.58H18.04V28.57Z" />
                        <path d="M6.01 0H0V6.01H6.01V0Z" />
                        <path d="M12.03 22.55H0V34.58H12.03V22.55Z" />
                      </g>
                    </svg>
                  </span>
                  <span class="decor-title__corner decor-title__corner--right">
                    <svg viewBox="0 0 19 35" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path d="M18.04 28.57H12.03V34.58H18.04V28.57Z" />
                        <path d="M6.01 0H0V6.01H6.01V0Z" />
                        <path d="M12.03 22.55H0V34.58H12.03V22.55Z" />
                      </g>
                    </svg>
                  </span>
                </h2>
                <form class="form decor-corners" />
                  <input type="hidden" name="project_name" value="NFT"/>
                  <input type="hidden" name="form_subject" value="Join the club"/>
                  <div class="row form-groups__row row-gutters">
                    <div class="form-group col-w-33 col-gutters">
                      <input type="text" class="form-input js-required-input" name="name" placeholder="Name"/>
                    </div>
                    <div class="form-group col-w-33 col-gutters">
                      <input type="email" class="form-input js-required-input" name="email" placeholder="email"/>
                    </div>
                    <div class="form-group col-w-33 col-gutters">
                      <button class="btn btn-wide btn-right-corner" type="submit">Join</button>
                    </div>
                  </div>
              </div>
            </div>
            <div class="characters-slider js-characters-slider">
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T17.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T17.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T18.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T18.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T19.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T19.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T20.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T20.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T21.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T21.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T22.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T22.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T23.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T23.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T24.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T24.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T25.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T25.jpg" alt=""/></noscript></div></div>
              <div class="character-card"><div class="character-card__img"><img  alt="" data-src="wp-content/uploads/2021/11/T26.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/T26.jpg" alt=""/></noscript></div></div>
            </div>
          </div>
        </section>



        
        <AccordionWrapper>
          {data1.map((item, index) => (
            <AccordionItem key={index} index={index} title={item.title} description={item.description} />
          ))}
        </AccordionWrapper>






      </main>
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="row align-vertical-center align-horisontal-between footer__row">
              <div class="footer-logo__col">
                <div class="row align-vertical-center align-horisontal-start">
                    <span class="logo">
                      <img  alt="" data-src="wp-content/uploads/2021/11/logo-footer.svg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><noscript><img src="wp-content/uploads/2021/11/logo-footer.svg" alt=""/></noscript>
                    </span>
                  <nav class="nav js-nav">
                    <p class="nav__title">Menu</p>
                    <button class="btn-close js-close-mobile-menu-btn" type="button">
                      <svg viewBox="0 0 14 14"  xmlns="http://www.w3.org/2000/svg">
                        <g >
                          <path d="M2.69 0H0V2.69H2.69V0Z" />
                          <path d="M5.41998 2.73001H2.72998V5.42001H5.41998V8.09001V8.11001H8.10998V10.78H10.8V8.09001H8.10998V5.42001V5.40001H5.41998V2.73001Z" fill="#FFD587"/>
                          <path d="M5.40997 8.10999H2.71997V10.8H5.40997V8.10999Z" />
                          <path d="M2.71002 10.81H0.0200195V13.5H2.71002V10.81Z" />
                          <path d="M13.52 10.81H10.83V13.5H13.52V10.81Z" />
                          <path d="M10.8 2.70999H8.10999V5.39999H10.8V2.70999Z"/>
                          <path d="M13.5001 0H10.8101V2.69H13.5001V0Z" />
                        </g>
                      </svg>
                    </button>
                    <ul class="nav__list">
                      <li class="nav__item"><a href="#story" class="nav__link js-smooth-scroll-link">Story</a></li>
                      <li class="nav__item"><a href="#roadmap" class="nav__link js-smooth-scroll-link">Roadmap</a></li>
                      <li class="nav__item"><a href="#collection" class="nav__link js-smooth-scroll-link">Collection</a></li>
                      <li class="nav__item"><a href="#charity" class="nav__link js-smooth-scroll-link">Charity</a></li>
                      <li class="nav__item"><a href="#team" class="nav__link js-smooth-scroll-link">Team</a></li>
                    </ul>
                  </nav>
                </div>
              </div>
                <ul class="socials">
                    <li class="socials-item">
                      <a href="https://discord.com/invite/inventorclubnft" class="socials-link" target="_blank" rel="nofollow">
                        <svg  viewBox="0 0 42 30" width="42" height="30" xmlns="http://www.w3.org/2000/svg">
                      <g >
                        <path d="M28.05 26.71C29.11 28.05 30.3801 29.56 30.3801 29.56C38.1501 29.31 41.14 24.21 41.14 24.21C41.0165 17.0732 39.2762 10.0573 36.05 3.69002C33.2157 1.46442 29.7596 0.174922 26.16 1.52588e-05L25.67 0.560013C31.67 2.39001 34.4301 5.03001 34.4301 5.03001C31.1543 3.22347 27.5567 2.07524 23.84 1.65001C21.4757 1.39084 19.0889 1.41435 16.73 1.72002C16.5286 1.72853 16.3281 1.75192 16.1301 1.79001C13.3642 2.10964 10.6651 2.85864 8.13005 4.01001C6.83005 4.61001 6.05005 5.01001 6.05005 5.01001C6.05005 5.01001 8.97005 2.23001 15.3101 0.400009L14.9601 -0.019989C11.3606 0.154917 7.90442 1.44441 5.07005 3.67001C1.86296 10.0482 0.146455 17.0715 0.0500488 24.21C0.0500488 24.21 3.05005 29.31 10.7801 29.56C10.7801 29.56 12.09 27.98 13.14 26.64C10.6677 26.0127 8.49012 24.5457 6.98005 22.49C6.98005 22.49 7.34005 22.73 7.98005 23.08C8.01832 23.1263 8.06606 23.1638 8.12005 23.19C8.22005 23.26 8.33005 23.3 8.44005 23.37C9.26752 23.8269 10.1263 24.2246 11.01 24.56C12.6825 25.226 14.4133 25.7349 16.18 26.08C19.1906 26.6432 22.2795 26.6432 25.2901 26.08C27.0461 25.7764 28.761 25.2696 30.4001 24.57C31.8067 24.0278 33.1483 23.3301 34.4001 22.49C32.8486 24.6029 30.5989 26.098 28.05 26.71ZM14.05 20.94C13.057 20.8933 12.1226 20.4562 11.4503 19.7239C10.7779 18.9916 10.422 18.0234 10.4601 17.03C10.4386 16.5375 10.5145 16.0455 10.6833 15.5823C10.8522 15.1191 11.1108 14.6937 11.4442 14.3305C11.7777 13.9674 12.1795 13.6735 12.6266 13.4658C13.0737 13.2581 13.5574 13.1406 14.05 13.12C14.5439 13.1366 15.0296 13.2515 15.4786 13.4578C15.9276 13.6642 16.331 13.958 16.6652 14.322C16.9994 14.686 17.2577 15.113 17.4251 15.5779C17.5925 16.0429 17.6656 16.5365 17.64 17.03C17.6615 17.5291 17.583 18.0274 17.4091 18.4958C17.2353 18.9641 16.9696 19.393 16.6277 19.7572C16.2859 20.1214 15.8746 20.4137 15.4183 20.6168C14.9619 20.8199 14.4695 20.9298 13.97 20.94H14.05ZM26.9001 20.94C25.907 20.8933 24.9726 20.4562 24.3003 19.7239C23.6279 18.9916 23.272 18.0234 23.3101 17.03C23.2886 16.5375 23.3645 16.0455 23.5333 15.5823C23.7022 15.1191 23.9608 14.6937 24.2942 14.3305C24.6277 13.9674 25.0295 13.6735 25.4766 13.4658C25.9237 13.2581 26.4075 13.1406 26.9001 13.12C27.3927 13.1406 27.8764 13.2581 28.3235 13.4658C28.7706 13.6735 29.1724 13.9674 29.5059 14.3305C29.8393 14.6937 30.0979 15.1191 30.2668 15.5823C30.4356 16.0455 30.5115 16.5375 30.4901 17.03C30.5115 17.5291 30.4329 18.0274 30.2591 18.4958C30.0853 18.9641 29.8196 19.393 29.4777 19.7572C29.1359 20.1214 28.7247 20.4137 28.2683 20.6168C27.8119 20.8199 27.3195 20.9298 26.8201 20.94H26.9001Z"/>
                      </g>
                    </svg>
                      </a>
                    </li>
                    <li class="socials-item">
                      <a href="#" class="socials-link" target="_blank" rel="nofollow">
                        <svg  viewBox="0 0 37 29"  xmlns="http://www.w3.org/2000/svg">
                      <g >
                        <path d="M35.6 1.48001L29.84 3.15001C29.0842 2.06047 28.0441 1.19907 26.8328 0.659546C25.6215 0.12002 24.2855 -0.0769618 22.97 0.0900116C21.8545 0.226045 20.7802 0.595559 19.8171 1.17448C18.8539 1.75341 18.0235 2.52876 17.38 3.45001C16.2419 5.28816 15.8151 7.47903 16.18 9.61C13.85 9.11 7.66003 4.32 3.81003 0C3.81003 0 2.52003 4.39001 4.81003 7.23001C4.10375 6.84935 3.43422 6.40411 2.81003 5.90001C2.81003 5.90001 2.81003 5.99001 2.81003 6.04001C2.81003 6.95001 2.81003 12.2 5.48003 14.35C4.90216 14.2157 4.33417 14.0419 3.78003 13.83C4.83631 16.7151 6.71337 19.2283 9.18002 21.06C7.35002 22.27 6.53002 22.67 1.54002 23.6C2.19021 23.9473 2.87803 24.2191 3.59003 24.41C2.44759 24.8321 1.24672 25.075 0.0300293 25.13L1.10004 25.57C5.18969 27.1505 9.5262 27.9969 13.91 28.07C21.63 28.07 31.09 24.85 32.44 9.54001L36.3 4.67001L31.2 5.98001L35.6 1.48001Z" />
                      </g>
                    </svg>
                      </a>
                    </li>
                    <li class="socials-item">
                      <a href="#" class="socials-link" target="_blank" rel="nofollow">
                        <svg viewBox="0 0 30 30"  xmlns="http://www.w3.org/2000/svg">
                      <g >
                        <path d="M25.41 0.0200043H4.55002C3.3449 0.0252669 2.19062 0.506338 1.33847 1.35849C0.486318 2.21064 0.00526258 3.36489 0 4.57001V25.45C0.00527871 26.6542 0.486677 27.8074 1.33911 28.658C2.19155 29.5085 3.34582 29.9874 4.55002 29.99H25.41C26.6142 29.9874 27.7685 29.5085 28.6209 28.658C29.4733 27.8074 29.9547 26.6542 29.96 25.45V4.57001C29.9547 3.36489 29.4737 2.21064 28.6215 1.35849C27.7694 0.506338 26.6151 0.0252669 25.41 0.0200043ZM14.97 23.41C12.7439 23.4074 10.6099 22.5212 9.03677 20.9462C7.46363 19.3711 6.58002 17.2361 6.58002 15.01C6.58002 12.7839 7.46363 10.6489 9.03677 9.07384C10.6099 7.49882 12.7439 6.61265 14.97 6.61C16.0769 6.60605 17.1738 6.82067 18.1976 7.24155C19.2214 7.66242 20.1521 8.28127 20.9362 9.06261C21.7203 9.84394 22.3425 10.7724 22.767 11.7947C23.1915 12.817 23.41 13.9131 23.41 15.02C23.3994 17.247 22.506 19.3789 20.9256 20.948C19.3452 22.5171 17.207 23.3953 14.98 23.39L14.97 23.41ZM24.41 7.73001C23.8345 7.73001 23.2825 7.50138 22.8756 7.09442C22.4686 6.68747 22.24 6.13552 22.24 5.56C22.24 4.98448 22.4686 4.43254 22.8756 4.02559C23.2825 3.61864 23.8345 3.39 24.41 3.39C24.9864 3.38999 25.5394 3.61831 25.948 4.02498C26.3565 4.43165 26.5874 4.98356 26.59 5.56C26.5874 6.13644 26.3565 6.68836 25.948 7.09503C25.5394 7.5017 24.9864 7.73002 24.41 7.73001Z" />
                        <path d="M14.99 21.11C18.37 21.11 21.11 18.37 21.11 14.99C21.11 11.61 18.37 8.87 14.99 8.87C11.61 8.87 8.87 11.61 8.87 14.99C8.87 18.37 11.61 21.11 14.99 21.11Z" />
                      </g>
                    </svg>
                      </a>
                    </li>
                                </ul>
                        </div>
          </div>
                    <p class="copyright text-center">All Rights Reserved.</p>
        </div>
      </footer>
      <div class="preloader__wrapper">
        <span class="preloader">
          <span class="preloader-inner"></span>
        </span>
        <div class="preloader__section preloader__section--left"></div> 
        <div class="preloader__section preloader__section--right"></div>
      </div>		
    </div>

    </s.Screen>

  );
}

export default App;
