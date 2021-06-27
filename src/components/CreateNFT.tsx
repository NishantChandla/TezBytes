import React,{useState} from 'react';
import { useFilePicker } from 'use-file-picker';
import { NFTStorage, File } from 'nft.storage';
import { isConstructorDeclaration } from 'typescript';
import {useHistory} from 'react-router-dom';


const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY0NmFmRGIyMjhhMGY1RjFhMURDNDQyMjFCQ0E4YTIwNTNlNWUzQzIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNDY0NjcyNjUwMiwibmFtZSI6IlRleiBCeXRlcyJ9.JfjY624-uOXE9naYfN7Z8QfY1bbO_bZcVihhHL5ke3I';
const client = new NFTStorage({ token: apiKey });


type ButtonProps = {
    contract:any;
};

const Create = ({contract}:ButtonProps) => {
    const history = useHistory();
    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        accept: ['.png','.jpg','.jpeg'],
        multiple:false,
        readAs: 'ArrayBuffer',
      });
      const [name, setName] = useState<string>("");
      const [description, setDescription] = useState<string>("");
      const [symbol, setSymbol] = useState<string>("");
      const [amount, setAmount] = useState<string>("0");
      const [error, setError] = useState<string>("");
      const [loadingSubmit, setLoading] = useState<boolean>(false);

      const onSubmit = (e:any) => {
          e.preventDefault()
          if(name==="" || description==="" || symbol==="" || amount=="" || (!(/^-?\d+$/.test(amount))) || filesContent.length===0){
              setError("Some Error Occurred. Please check entered details.");
              return;
          }
          setLoading(true);
          setError("");
        
        //   console.log(filesContent[0].content);
          (async () => {
                const metadata = await client.store({
                    name: name,
                    description: description,
                    image: new File([filesContent[0].content], filesContent[0].name, { type: 'image/'+filesContent[0].name.split('.')[1] })
                });
                try{
                    const op = await contract.methods.minter_entry(amount,description,metadata.data.image.href,name,symbol).send({mutez:true, amount:(parseInt(amount))*(20/100)});
                    await op.confirmation();
                    const handleOnClick = () => history.push('/');
                    handleOnClick();
                }catch(e){
                    console.log(e);
                }


                setLoading(false);
                setName("");
                setAmount("0");
                setDescription("");
                setSymbol("");

          })();

         
        //   console.log("true")
        //   console.log(filesContent.length)
          // assume valid
          // push values

          
      }

    //   if(loading||loadingSubmit){
    //       return (
    //             <div className="ui active dimmer">
    //                 <div className="ui loader"></div>
    //             </div>
    //     );
    //   }
    //   console.log(description)
    return (
    <div>
        <form className="ui form error">
            <div className={`field required ${loadingSubmit?'disabled':''}`}>
                <label>Token Name</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tez Bytes"/>
            </div>
            {(name.length>30)? (<div className="ui error message">
            <div className="header">Too long!</div>
            <p>The name must be less than 30 letters.</p>
        </div>):null}
            <div className={`field required ${loadingSubmit?'disabled':''}`}>
                <label>Description</label>
                <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="A digital art piece!"/>
            </div>
             {(description.length>300)? (<div className="ui error message">
            <div className="header">Too long!</div>
            <p>The Description must be less than 300 letters.</p>
        </div>):null}
            <div className={`field required ${loadingSubmit?'disabled':''}`}>
                <label>Symbol</label>
                <input type="text" value={symbol} onChange={(e)=>setSymbol(e.target.value)} placeholder="TBY"/>
            </div>
            {(Symbol.length>10)? (<div className="ui error message">
            <div className="header">Too long!</div>
            <p>The Symbol must be less than 10 letters.</p>
        </div>):null}
            <div className={`field required ${loadingSubmit?'disabled':''}`}>
                <label>Selling Amount (Mutez) (There is a 20% service fee)</label>
                <input type="text" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount"/>
            </div>
            {(!(/^-?\d+$/.test(amount)) && amount!="")? (<div className="ui error message">
            <div className="header">Only number allowed</div>
            <p>The amount must be a valid Mutez value.</p>
        </div>):null}
            <div className={`field required ${loadingSubmit?'disabled':''}`}>
                <label>Image</label>
                <button type="button" className="ui basic button" onClick={(event) => {openFileSelector(); event.preventDefault()}}>Select files </button>
                {(filesContent.length>0)?filesContent[0].name:''}
            </div>
            {(error)?
                (<div className="ui error message">
                <div className="header">Error</div>
                <p>{error}</p>
                </div>):null
            }
              
            {/* <div className="field">
                <div className="ui checkbox">
                <input type="checkbox" className="hidden"/>
                <label>I agree to the Terms and Conditions</label>
                </div>
            </div> */}
            <button className={`ui button ${loadingSubmit?'loading':''}`} onClick={(e)=>onSubmit(e)} type="submit">Mint</button>
            
        </form>
        
    </div>
        );
}


export default Create;