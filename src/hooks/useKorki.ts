
export interface Korki{
    id:number;
    play:boolean;
    type:number;
    customKey:string;
}

const useKorki = () => {
    const intialKorki: Korki[]=[];
    let id = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const key = `${i}${j}`;
            if(i <3 || i >4){
            if((i + j) % 2 === 0){
                intialKorki.push({id:id++,customKey:key,play:true,type:(i < 3) ? 1:(i > 4) ? 2:3})
            }}
        }
    }
    

    return intialKorki;
}
export default useKorki;