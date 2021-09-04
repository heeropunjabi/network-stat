import { IonGrid, IonRow, IonCol, IonText } from "@ionic/react";
const Transactions = ({ newBlock }) => {
  return (
    <IonGrid>
      <IonRow class='header-row'>
        <IonCol>
          <IonText>
            {" "}
            All transactions for block no. {newBlock.number} sorted by amount in
            the descending order.
          </IonText>
        </IonCol>
      </IonRow>
      {newBlock.transactions.map((transaction, index) => {
        return (
          <IonRow key={index}>
            <IonCol>
              <IonText>{transaction.hash}</IonText>
            </IonCol>

            <IonCol>
              <IonText>{transaction.value + " ether"}</IonText>
            </IonCol>
          </IonRow>
        );
      })}
    </IonGrid>
  );
};

export default Transactions;
