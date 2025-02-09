// 1# Any Tipi Hakkında:
// Any (any) TypeScript'teki kaçış mekanizmasıdır. 
// Bunu, kodunuzun dinamik ve JavaScript'e benzer olacağını belirtmek 
// veya TypeScript'in tür sistemindeki kısıtlamaları aşmak için kullanabilirsiniz.

// any için iyi bir kullanım örneği JSON ayrıştırmadır:

const myObject = JSON.parse("{}");

// any, TypeScript'e kodunuza güvenmesini söyler çünkü onun hakkında daha fazla bilgiye sahip olduğunuzu varsayar. 
// Ancak bu her zaman doğru olmayabilir. Örneğin, aşağıdaki kod hata verecektir:

myObject.x.y.z;

// any kullanmak, JavaScript'e daha yakın kod yazmanıza olanak tanır ancak 
// bunun karşılığında tür güvenliğini kaybedersiniz.
// any, bir tür "joker karakter" gibi çalışır. 
// Herhangi bir türle (never hariç) değiştirilebilir ve bir türün diğerine atanmasını sağlar.

declare function debug(value: any): void;

debug("bir string");
debug(23);
debug({ color: "mavi" });

// debug fonksiyonuna yapılan her çağrı geçerlidir çünkü 
// any yerine argümanın türüyle eşleşen bir tür konulabilir.
// TypeScript, any türünün farklı şekillerde nasıl kullanıldığını dikkate alır, 
// örneğin, aşağıdaki gibi tuple'lar ile birlikte kullanıldığında:

declare function swap(x: [number, string]): [string, number];

declare const pair: [any, any];
swap(pair);

// swap çağrısı geçerlidir çünkü pair değişkenindeki ilk any yerine number 
// ve ikinci any yerine string yerleştirilerek eşleşme sağlanabilir.
// Unknown (unknown) türü, any'nin bir alternatifi olarak düşünülebilir. 
// any "Ben neyin en iyi olduğunu biliyorum" demekken, 
// unknown "En iyisinin ne olduğundan emin değilim, 
// bu yüzden TypeScript'e türü söylemen gerekiyor" anlamına gelir.

// 2# Literaller Hakkında:

// TypeScript, kaynak kodda yer alan sabit değerler (literal'lar) için
// bazı eğlenceli özel durumlara sahiptir.

// Bunun büyük bir kısmı tür genişletme (widening) ve daraltma (narrowing)
// ile ilgilidir (bkz: type-widening-and-narrowing) ve öncelikle bunu ele almak faydalı olur.

// Bir literal, kolektif bir türün daha somut bir alt türüdür.
// Bunun anlamı şudur: "Hello World" bir string'dir, ancak bir
// string, tür sisteminde "Hello World" değildir.

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // Bu, bir string'dir çünkü let ile tanımlanmıştır.

// Bu fonksiyon tüm string değerlerini kabul eder.
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// Bu fonksiyon yalnızca "Hello World" string literal'ını kabul eder.
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// Bu yaklaşım, belirli bir literal'ı kabul eden API'ler
// tanımlamanıza olanak tanır:

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// İlk bakışta, bu kural karmaşık nesnelere uygulanmaz.

const myUser = {
  name: "Sabrina",
};

// `name: "Sabrina"` ifadesinin nasıl `name: string` olarak dönüştüğüne bakın,
// oysa sabit (const) olarak tanımlanmıştır. Bunun nedeni, bu özelliğin 
// herhangi bir zamanda değiştirilebilir olmasıdır:

myUser.name = "Cynthia";

// myUser nesnesinin name özelliği değişebilir olduğundan, TypeScript
// tür sisteminde literal sürümünü kullanamaz. Ancak bunu mümkün 
// kılan bir özellik vardır.

const myUnchangingUser = {
  name: "Fatma",
} as const;

// "as const" ifadesi nesneye uygulandığında, değişebilir bir nesne
// yerine değişmeyen (sabit) bir nesne literal'ı haline gelir.

myUnchangingUser.name = "Raîssa";

// "as const", sabit (fixtured) veriler için ve kodu satır içi (inline)
// literal'lar olarak ele aldığınız durumlar için harika bir araçtır.
// "as const" aynı zamanda dizilerle de çalışır:

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;


// 3#






