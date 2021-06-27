import React,{ Dispatch, SetStateAction} from 'react';
import ConnectButton from "./ConnectWallet";
import DisconnectButton from "./DisconnectWallet";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from 'react-router-dom';


type ButtonProps = {
  Tezos: TezosToolkit;
  setContract: Dispatch<SetStateAction<any>>;
  setTokenContract: Dispatch<SetStateAction<any>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setStorage: Dispatch<SetStateAction<number>>;
  setTokenStorage: Dispatch<SetStateAction<any>>;
  contractAddress: string;
  tokenContractAddress: string;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  wallet: BeaconWallet;
  publicToken: string | null;
  userAddress:string;
  userBalance: number;
  setTezos: Dispatch<SetStateAction<TezosToolkit>>;
};

const Header = ({
  Tezos,
  setContract,
  setTokenContract,
  setWallet,
  setUserAddress,
  setUserBalance,
  setStorage,
  setTokenStorage,
  contractAddress,
  tokenContractAddress,
  setBeaconConnection,
  setPublicToken,
  wallet,
  publicToken,
  userAddress,
  userBalance,
  setTezos,
}: ButtonProps): JSX.Element  => {
    // console.log(publicToken);
    // console.log(userAddress);
    // console.log(userBalance);
    return (
       
        <div className="ui menu">
            <div className="item ui header">Tez Bytes</div>
            <div className="item">
            <Link to="/">Home</Link>
            </div>
        {/* <a className="item" href="/">
            Explore
        </a> */}
        {/* <a className="item" href="/">
            Latest
        </a> */}
        {/* <a className="item" href="/">
            Home
        </a> */}

        {/* <div className="item">
            <Link to="/mynfts">  My NFTs</Link>
          
        </div> */}
        
        {/* <div className="item right aligned">
            Connect Wallet
        </div> */}
          {(!publicToken && !userAddress)?
          null
         :
         <div className="item">
            <Link to="/createnft">Create NFT</Link>
          </div>
        }
        {(!publicToken && !userAddress)?
          <ConnectButton
            Tezos={Tezos}
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
          />:
            <DisconnectButton
            wallet={wallet}
            setPublicToken={setPublicToken}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setWallet={setWallet}
            setTezos={setTezos}
            setBeaconConnection={setBeaconConnection}
            />
        }
        </div>
      
    );
}


export default Header;