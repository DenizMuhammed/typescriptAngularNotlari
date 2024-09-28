const objem = {
eleman1: 'deneme,
eleman2: 'deneme2'
eleman3: 32,
eleman4: 34 | 54 // bu elemana sadece 34 ve 54 değerleri atanabilir.
};

//Objeyi tanımlarken tipleri başta belirtmek:

const objem2 : {
eleman1 : string,
eleman2 : number,

} = {
eleman1 : 'deneme',
eleman2 : 43
};

// Çok tipli dizi
const dizi : (string, number, boolean) [] = [];

const dizi2 = [] as Array<string>; //

// yeni tip tanımlama (type aliasing):
type Colors = 'blue' | 'red' | 'orange';

type Okul = {
  sinif : string[],
  seviye: string,
  nufus: number
}

// Tipleri birleştirme:
type ColorsOkul = Colors & Okul;

