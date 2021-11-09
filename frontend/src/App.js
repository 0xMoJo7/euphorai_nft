import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/example.png";
import tl from "./assets/images/twitter.png";
import dl from "./assets/images/discord.png";
import os from "./assets/images/opensea.png"


export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: #2cafc9;
  padding: 10px;
  font-weight: bold;
  color: #ffffff;
  width: 250px;
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

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 60%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 400px;
    height: 400px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;


export const StyledRow = styled.div`
  display: inline-block;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState(".025 Mint Price");
  const [claimingNft, setClaimingNft] = useState(false);
  const [val, setVal] = useState("");

  ///////////////////////////////// Count down function (ED)

  const calculateTimeLeft = () => {
    let difference =
      +new Date(`10/20/2021`).setHours(new Date().getHours() + 20) -
      +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting your EuphorAI...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mintNFTs(_amount)
      .send({
        gasLimit: (180000 * _amount).toString(),
        to: "0x151f56881146f5bda180f38111e89b8e28b0b954",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(
          (0.025 * _amount).toString(),
          "ether"
        ),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback(
          "Sorry, something went wrong please try again later or contact support"
        );
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback("You now own a EuphorAI! go visit Opensea.io to view it.");
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--white)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 58 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 36, fontWeight: "bold" }}
        >
          Welcome to EuphorAI
        </s.TextTitle>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={i1} />
            <s.SpacerMedium />
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}
            >
              {data.totalSupply}/5000
            </s.TextTitle>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ padding: 36 }}
          >
            {Number(data.totalSupply) == 5000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still find EuphorAI's on{" "}
                  <a
                    target={"_blank"}
                    href={"https://opensea.io/collection/euphorai"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>
                  The Euphoria Collection
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextTitle style={{ textAlign: "center", fontSize: 20 }}>
                  Public Sale
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", fontSize: 14 }}
                >
                  {feedback}
                </s.TextDescription>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", fontSize: 12 }}
                >
                  Excluding gas fee.
                </s.TextDescription>
                <s.SpacerXSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT TO METAMASK
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{ textAlign: "center", fontSize: 24 }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <div align="center">
                      <form>
                        <input
                          max="5"
                          size="16"
                          type="number"
                          name="mintNum"
                          placeholder="How many? Max of 5"
                          onChange={(e) => setVal(e.target.value)}
                        />
                      </form>
                      <s.SpacerSmall />
                      <></>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(val);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT 1 EIA"}
                      </StyledButton>
                    </div>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "50%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 16 }}>
            EuphorAi (pronounced You-For-Ayy-Eye) is a digital art collective
            whose goal is building a digital ecosystem through community-centric
            art. The first original collection titled The Euphoria Collection –
            consists of 5,000 generative art pieces with the central theme of
            euphoria. These static images are generated using a hyperbolic
            tangent function to create "waves" with a combination of seeds that
            determine layers and colors which contributes to the overall
            complexity or simplicity of each piece. This is the first of 3
            planned collections - with The Dysphoria Collection and The Delirium
            Project coming late 2021/early 2022. Our vision for EuphorAi is big
            and it all starts with this first collection. If you would like more
            details on how we are planning 1, 5, and 10 years down the road,
            read our whitepaper <a href="https://euphorai.medium.com/">here</a>.
          </s.TextDescription>
        </s.Container>
        <s.SpacerSmall />
        <s.SpacerSmall />
        <div>
          <a href="https://twitter.com/EuphorAI_NFT">
            <img src={tl} width="50" height="50" />
          </a>
          <spacer type="horizontal"> </spacer>
          <a href="https://discord.gg/2ApZzBcX">
            <img src={dl} width="50" height="50" />
          </a>
          <spacer type="horizontal"> </spacer>
          <a href="https://opensea.io/collection/euphorai-digital-collective">
            <img src={os} width="50" height="50" />
          </a>
        </div>
        <s.SpacerLarge />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.SpacerSmall />
          <s.TextDescription style={{ textAlign: "center", fontSize: 10 }}>
            Please make sure you are connected to the right network (Ethereum
            Mainnet) and the correct address. Please note: Once you make the
            purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
