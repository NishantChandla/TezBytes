import React, { useEffect, useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import { Tzip12Module } from "@taquito/tzip12";
import ShowToken from "./components/ShowTokens";
import qrcode from "qrcode-generator";
import UpdateContract from "./components/UpdateContract";
import Transfers from "./components/Transfers";
import Header from './components/Header';
import CreateNFT from './components/CreateNFT';
import TokenComponent from './components/Token';
import {tzip12} from '@taquito/tzip12';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom';


enum BeaconConnection {
    NONE = "",
    LISTENING = "Listening to P2P channel",
    CONNECTED = "Channel connected",
    PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
    PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
  }

  type token ={
    decimal:number;
    description:string;
    name:string;
    image:string;
    symbol:string;
    token_id:string;
    sale?:boolean;
    amount?:number;
    owner?:string;
  
  }
const App = () => {
  let match = useRouteMatch();
  
    const [Tezos, setTezos] = useState<TezosToolkit>(
        new TezosToolkit("https://granadanet.smartpy.io/")
      );
      const [contract, setContract] = useState<any>(undefined);
      const [tokenContract, setTokenContract] = useState<any>(undefined);
      const [publicToken, setPublicToken] = useState<string | null>("");
      const [wallet, setWallet] = useState<any>(null);
      const [userAddress, setUserAddress] = useState<string>("");
      const [userBalance, setUserBalance] = useState<number>(0);
      const [storage, setStorage] = useState<any>({});
      const [tokenStorage, setTokenStorage] = useState<Array<token>>([]);
      const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
      const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
      const [activeTab, setActiveTab] = useState<string>("transfer");


            //minter
      // const contractAddress: string = "KT1KRxtTDy6HhKpG1yYtJ9GS3ivs2fRqJqDg";
      const contractAddress:string = "KT1QTq4Wj8SReYUb4qKJjnE9mZ4vycq7RU2B";
      //token contract
      // const tokenContractAddress: string = "KT1U4PPhYkAhDCJTFgDXZaZuiEeze63KasDV";
      const tokenContractAddress:string = "KT1UW5SVHwGMiKaHW49kcgFva5kXAAQRJATK";
        // console.log(storage);
        // console.log(tokenStorage);
        Tezos.addExtension(new Tzip12Module());
        useEffect(()=>{

      
      (async (): Promise<void> => {
        // setUserAddress(userAddress);
        // // updates balance
        // const balance = await Tezos.tz.getBalance(userAddress);
        // setUserBalance(balance.toNumber());
        // creates contract instance
        const contract = await Tezos.wallet.at(contractAddress);
        const tokenContract = await Tezos.wallet.at(tokenContractAddress, tzip12);
        const storageTemp: any = await contract.storage();
        const tokenStorage : any = await tokenContract.storage();
        const tokenCount:number = tokenStorage.all_tokens.c[0];
        let tempMetadata:any = [];
        for(let i=0;i<tokenCount;i++){
          tempMetadata[i]=(await tokenContract.tzip12().getTokenMetadata(i));
        }
        let storage:any = [];
        let tokenMetadata:Array<token> = [];
        tempMetadata.forEach(function(element:any){
          tokenMetadata.push({decimal:element.decimal,description:element.description, name:element.name,image:element.image,token_id:element.token_id,symbol:element.symbol})
        });
    
        let x:number = 0;
        storageTemp.saleMap.valueMap.forEach(function(element:any, key:number){
          // console.log(element);
          tokenMetadata[x].sale=element.sale;
          tokenMetadata[x].amount = element.amount.c[0] / 1000000;
          tokenMetadata[x].owner = element.owner;
          x++;
        });
    
        setContract(contract);
        setTokenContract(tokenContract);
        setStorage(storage);
        setTokenStorage(tokenMetadata);
      })();
    },[]);



      // console.log(match)
      if(tokenStorage.length<1 && false){
        return ( <div className="ui container">
        
            <div className="ui active dimmer"> 
            <div className="ui text loader">Loading...</div>
             
          </div>
           </div>);

      }else{
    return (
     
        <div className="ui container">
            <Header  Tezos={Tezos}
            setContract={setContract}
            setTokenContract = {setTokenContract}
            setPublicToken={setPublicToken}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setStorage={setStorage}
            setTokenStorage={setTokenStorage}
            contractAddress={contractAddress}
            tokenContractAddress={tokenContractAddress}
            setBeaconConnection={setBeaconConnection}
            wallet={wallet} 
            publicToken={publicToken}
            userAddress={userAddress}
            userBalance={userBalance}
            setTezos={setTezos}/>

          <Switch>
           
           
            <Route path="/createnft">
              <CreateNFT contract={contract} />
            </Route>
            {(tokenStorage.length>0 && window.location.href.includes('/token/') && (typeof tokenStorage[window.location.href.split('/token/')[1]] !== 'undefined'))?
            <Route path={`/token/:token_id`}>
              {console.log(window.location.href)}
              {/* {console.log(window.location.href.split('/token/')[1])} */}
            <TokenComponent contract={contract} 
              decimal={tokenStorage[window.location.href.split('/token/')[1]].decimal} 
              name={tokenStorage[window.location.href.split('/token/')[1]].name} 
              image={tokenStorage[window.location.href.split('/token/')[1]].image} 
              symbol={tokenStorage[window.location.href.split('/token/')[1]].symbol} 
              token_id={tokenStorage[window.location.href.split('/token/')[1]].token_id} 
              sale={tokenStorage[window.location.href.split('/token/')[1]].sale} 
              amount={tokenStorage[window.location.href.split('/token/')[1]].amount} 
              owner={tokenStorage[window.location.href.split('/token/')[1]].owner} 
              description={tokenStorage[window.location.href.split('/token/')[1]].description}/>;
            </Route>
              :null}
            <Route path="/">
              <ShowToken contract={contract} tokenStorage={tokenStorage} storage={storage}/>
            </Route>
           {/* <Route path="/createnft">
            <CreateNFT contract={contract} />
            </Route> */}
          </Switch>

            
            {/* <CreateNFT contract={contract} /> */}
        </div>
        );
        }
};

export default App;
