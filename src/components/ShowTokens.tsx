import React from 'react';
import { ReactComponent as TezosLogo} from './tezos.svg';
import TokenComponent from './Token';
import {useHistory} from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom';



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

type ButtonProps = {
    tokenStorage: Array<token>;
    storage: any;
    contract:any;
};

const ShowToken = ({tokenStorage,storage,contract}:ButtonProps) => {
    // if(tokenStorage.length>0)
    // return <TokenComponent contract={contract} decimal={tokenStorage[1].decimal} name={tokenStorage[1].name} image={tokenStorage[1].image} symbol={tokenStorage[1].symbol} token_id={tokenStorage[1].token_id} sale={tokenStorage[1].sale} amount={tokenStorage[1].amount} owner={tokenStorage[1].owner} description={tokenStorage[1].description}/>;
    let match = useRouteMatch();
    const history = useHistory();
  // console.log(match.params.token_id)
    const onClick = (e:any,token_id:string) =>{
      if(e){
        const handleOnClick = () => history.push('/token/'+token_id);
        handleOnClick();
      }
      //nav to token page
    }


    const tokens = tokenStorage.map((item:token)=>{
        return (
        <div className="column" key={item.token_id} onClick={(e)=>onClick(item.sale,item.token_id)}>
            <div  className="ui fluid card">
        <div className="image">
          <img style={{'maxHeight':"200px",'objectFit':'cover'}} src={`https://ipfs.io/ipfs/${item.image.split('ipfs://')[1]}`}/>
        </div>
        <div className="content">
          <div className="right floated">
            Price:
            <div style={{color:'black'}}><TezosLogo /> {item.amount}</div>
          </div>
            <div className="header">{item.name}</div>
            <div className="meta">
              <a>{item.symbol}</a>
            </div>
            <div className="description">
              {(item.description.length > 15)?item.description.slice(0,15)+"...":item.description}
            </div>
      
        
        </div>
       
        <div className="extra content">
          <span className="right floated">
            <button className="ui basic button">{(item.sale)?'Buy':'Sold Out'}</button>
          </span>
          <span>
            Token ID: 
            <div style={{color:'black'}}>{item.token_id}</div>
          </span>
        </div>
      </div>
      </div>);
    })

    return (
         <div className="ui link three column grid cards">
            {tokens}
        </div>);
}

export default ShowToken;