import React from 'react';
import { ReactComponent as TezosLogo} from './tezos.svg';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import {useHistory} from 'react-router-dom';

type token ={
    decimal:number;
    description:string;
    name:string;
    image:string;
    symbol:string;
    token_id:string;
    sale?:boolean;
    amount:number;
    owner?:string;
    contract:any;
  }
  

const Token = ({decimal,description,name,image,symbol,token_id,sale,amount,owner,contract}:token) => {
    const history = useHistory();
    const onClick = (x:any) => {
        //buy the token
        console.log(token_id);
       (async ()=>{
            try{
                const op = await contract.methods.buy(token_id).send({mutez:true,amount:(amount*1000000)});
                await op.confirmation();

                //redirect
                const handleOnClick = () => history.push('/');
                handleOnClick();
            }catch(e){
                console.log(e);
            }
        })();
        //redirect to your token
    }


    return (
    <div className="ui internally celled grid">
        <div className="ui">
            {description}
        </div>
        <div className="row">
            <div className="nine wide column">
            <img src={`https://ipfs.io/ipfs/${image.split('ipfs://')[1]}`}/>
            </div>
            <div className="seven wide column container center">
            <div className="ui">
                <h3 className="ui right floated header">
                    {name}
                </h3>
                <h3 className="ui left aligned header">
                    Name 
                </h3>
            </div>
            {/* <div className="ui">
                <h3 className="ui right floated header">
                    {description}
                </h3>
                <h3 className="ui left aligned header">
                    Description 
                </h3>
            </div> */}
            <div className="ui">
                <h3 className="ui right floated header">
                    {symbol}
                </h3>
                <h3 className="ui left aligned header">
                    Symbol 
                </h3>
            </div>
            <div className="ui " onClick={() => {navigator.clipboard.writeText(owner+"")}}>
                <h3 className="ui right floated header green" style={{'cursor':'pointer'}}  data-content="Copy to clipboard" >
                    {owner?.slice(0,6) + "..."}
                </h3>
                <h3 className="ui left aligned header">
                    Owner
                </h3>
            </div>
            <div className="ui">
                <h3 className="ui right floated header">
                    {amount}
                </h3>
                <h3 className="ui left aligned header">
                    Price <TezosLogo /> 
                </h3>
            </div>
            <div className="ui">
                <h3 className="ui right floated header">
                    {token_id}
                </h3>
                <h3 className="ui left aligned header">
                    Token ID 
                </h3>
            </div>
            <div  className="ui">
            <button className="fluid ui button basic green" onClick={(e)=>onClick(e)}>Buy</button>
            </div>
            {/* <div className="ui vertical segment center aligned">
                <h4 className="sub header">
                    Name: {name}
                </h4>
                </div>
                <div className="ui vertical segment">
                <p></p>
                </div>
                <div className="ui vertical segment">
                <p></p>
                </div> */}
           
            </div>
          
        </div>
  </div>

    );

}

export default Token;