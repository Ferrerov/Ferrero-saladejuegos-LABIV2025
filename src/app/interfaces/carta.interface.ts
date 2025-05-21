export interface CartaInterface {
    code:string;
    image:string;
    value:string;
    suit:string;
}

export interface MazoCartasInterface{
    success: boolean;
    deck_id:string;
    cards:Array<CartaInterface>;
}
