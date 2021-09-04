import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonToast,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import Transactions from "../components/Transactions";
import "./Home.css";

const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://mainnet.infura.io/ws/v3/7b08509ad8d54176a5e69c5bf0b2bf6f"
  )
);

const Home = () => {
  const [newBlock, setNewBlock] = useState({});
  const [subscription, setSubscription] = useState({});

  const [toastMsg, setToastMsg] = useState("");

  const subscribe = useCallback(() => {
    const subRef = web3.eth
      .subscribe("newBlockHeaders", (error, result) => {
        if (error) {
          setToastMsg("Error connecting to ETH blockchain.");
        }
        if (!error) {
          return;
        }
      })
      .on("connected", () => {
        setToastMsg(" You are connected to the ETH blockchain.");
        setSubscription(subRef);
      })
      .on("data", async (blockHeader) => {
        if (blockHeader.number !== null) {
          try {
            const block = await web3.eth.getBlock(blockHeader.number, true);

            let transactions = block.transactions.map((transaction) => {
              const etherValue = Web3.utils.fromWei(transaction.value, "ether");
              transaction.value = parseFloat(etherValue);
              return transaction;
            });
            transactions.sort(
              (transactionA, transactionB) =>
                transactionB.value - transactionA.value
            );
            block.transactions = transactions;

            setNewBlock(block);
          } catch (e) {
            setToastMsg(e.toString());
          }
        }
      })
      .on("error", () => {
        setToastMsg("Error connecting to ETH blockchain.");
      });
    console.log("ref", subRef);
  }, []);
  const unSubscribe = useCallback(() => {
    subscription.unsubscribe((error, success) => {
      if (success) {
        setToastMsg("Successfully unsubscribed!");
        setSubscription({});
      } else {
        setToastMsg("Unable to unsubscribed!");
      }
    });
  }, [subscription]);
  useEffect(() => {
    subscribe();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonTitle>Ethereum Blockchain Network Stat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid class='ion-text-center'>
          <IonRow class='ion-margin'>
            <IonCol>
              <IonTitle>
                <IonText color='default'>Ethereum latest blocks</IonText>
              </IonTitle>
            </IonCol>
          </IonRow>

          <IonRow class='header-row'>
            <IonCol>
              <IonText>Block Number</IonText>
            </IonCol>

            <IonCol>
              <IonText>Number of transactions</IonText>
            </IonCol>

            <IonCol>
              <IonText>Miner (address that mined the block)</IonText>
            </IonCol>
            <IonCol>
              <IonText>Total difficulty</IonText>
            </IonCol>
          </IonRow>
          {newBlock.number ? (
            <IonRow>
              <IonCol>
                <IonText>{newBlock.number}</IonText>
              </IonCol>

              <IonCol>
                <IonText>
                  {newBlock.transactions ? newBlock.transactions.length : ""}
                </IonText>
              </IonCol>

              <IonCol>
                <IonText>{newBlock.miner}</IonText>
              </IonCol>
              <IonCol>
                <IonText>{newBlock.totalDifficulty}</IonText>
              </IonCol>
            </IonRow>
          ) : (
            <IonRow className='ion-justify-content-center ion-align-items-center'>
              <IonSpinner name='crescent' />
              <IonText>
                waiting for latest block to be created on the blockchain.
              </IonText>
            </IonRow>
          )}
        </IonGrid>
        <IonButton
          color='warning'
          onClick={() => {
            if (subscription.id) {
              unSubscribe();
            } else {
              subscribe();
            }
          }}
        >
          {subscription.id ? "Pause" : "Resume"}
        </IonButton>
        {newBlock.number ? <Transactions newBlock={newBlock} /> : <Fragment />}

        <IonToast
          isOpen={Boolean(toastMsg)}
          duration={4000}
          message={toastMsg}
          color={"dark"}
          onWillDismiss={() => {
            setToastMsg("");
          }}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default Home;
