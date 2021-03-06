import store from "./store";
export default function t (a:string) {
  var codeNow = store.getState().app.languageCode;
  var words = store.getState().app.languageWords;
  if(codeNow === "en") {
    return a;
  }else{
    if(typeof words[codeNow][a] !== "undefined") {
      return words[codeNow][a];
    }else if (/(\d{1,}$)|(^\d{1,}$)/g.test(a)) {
      return a;
    }else{
      console.log(`"${a}":"",`);
      return a;
    }
  }
}
