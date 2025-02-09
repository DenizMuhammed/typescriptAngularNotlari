/************************************************************************************************
*************************************************************************************************/
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

/************************************************************************************************
*************************************************************************************************/
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

/************************************************************************************************
*************************************************************************************************/
// 3# Tür birleşimi Ve Kesişim

// Tür birleşimleri, bir nesnenin birden fazla türde olabileceğini belirtmenin bir yoludur.

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// Eğer "open" ve "closed" gibi sabit değerlerin string yerine kullanımı size yeni geliyorsa,
// şu kaynağa göz atabilirsiniz: example:literals

// Farklı türleri bir birleşimde (union) bir araya getirebiliriz. 
// Burada söylediğimiz şey, değerin bu türlerden biri olduğudur.

// TypeScript, çalıştırma zamanında hangi değerin kullanılacağını
// belirlemenizi size bırakır.

// Ancak birleşimler bazen tür genişletmesi (type widening) nedeniyle etkisini kaybedebilir. 
// Örneğin:

type WindowStates = "open" | "closed" | "minimized" | string;

// Üzerine geldiğinizde görebileceğiniz gibi, WindowStates yalnızca 
// belirtilen üç değerden biri değil, genel olarak bir string türüne dönüşmüştür.
// Bu konu hakkında daha fazla bilgi için: example:type-widening-and-narrowing

// Eğer birleşimler "VEYA" (OR) anlamına geliyorsa, kesişimler (intersections) "VE" (AND) anlamına gelir. 
// Kesişim türleri, iki türün birleşerek yeni bir tür oluşturmasıdır. 
// Bu, tür bileşimini (composition) mümkün kılar.

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// Bu arayüzler, hem tutarlı bir hata yönetimi hem de kendi verilerini içeren 
// yanıtlar oluşturmak için birleştirilebilir.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// Örneğin:

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// Kesişim ve birleşim türlerinin birlikte kullanımı, bir nesnenin 
// iki değerden birini içermesi gerektiği durumlarda oldukça faydalıdır.

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = CreateArtistBioBase & ({ html: string } | { markdown: string });

// Artık sadece artistID ve html veya markdown içeren bir istek oluşturabilirsiniz.

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy, anonim bir İngiliz grafiti sanatçısıdır...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};

/************************************************************************************************
*************************************************************************************************/
// 4# Unknown ve Never Hakkında:

// Unknown
// Unknown, mantığını anladığınızda birçok kullanım alanı bulabileceğiniz türlerden biridir. 
// any türüne benzer şekilde çalışır, ancak önemli bir farkı vardır: 
// any belirsizliğe izin verirken, unknown belirli olmayı gerektirir.

// Bunu anlamanın iyi bir yolu, bir JSON ayrıştırıcısını sarmalamaktır. 
// JSON verileri birçok farklı biçimde gelebilir ve JSON ayrıştırma fonksiyonunu yazan kişi 
// verinin şeklini bilmez - ancak o fonksiyonu çağıran kişi bilmelidir.

const jsonParser = (jsonString: string) => JSON.parse(jsonString);

const myAccount = jsonParser(`{ "name": "Dorothea" }`);

myAccount.name;
myAccount.email;

// jsonParser fonksiyonunun üzerine geldiğinizde, dönüş türünün any olduğunu görebilirsiniz. 
// Bu yüzden myAccount da any türünde olur. Bunu jenerikler (generics) ile düzeltebiliriz, 
// ancak unknown ile de düzeltebiliriz.

const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

myOtherAccount.name;

// myOtherAccount nesnesi, TypeScript’e türü belirtilene kadar kullanılamaz. 
// Bu, API kullanıcılarının türleri önceden düşünmesini sağlamak için kullanılabilir.

type User = { name: string };
const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
myUserAccount.name;

// Unknown, oldukça kullanışlı bir araçtır. Daha fazla bilgi için şu kaynaklara göz atabilirsiniz:
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// Never
// TypeScript kod akışı analizini desteklediğinden, dilin mantıksal olarak asla gerçekleşmeyecek 
// durumları temsil etmesi gerekir. Örneğin, bu fonksiyon hiçbir zaman bir değer döndüremez:

const neverReturns = () => {
  // İlk satırda hata fırlatırsa
  throw new Error("Her zaman hata fırlatır, asla dönmez");
};

// Eğer türünün üzerine gelirseniz, (() => never) olduğunu görürsünüz, 
// bu da fonksiyonun asla bir şey döndürmemesi gerektiğini ifade eder. 
// Ancak yine de diğer değerler gibi atanabilir:

const myValue = neverReturns();

// Bir fonksiyonun hiçbir zaman dönmemesi, JavaScript çalışma zamanı 
// ve tür kullanmayan API tüketicileriyle çalışırken faydalı olabilir.

const validateUser = (user: User) => {
  if (user) {
    return user.name !== "NaN";
  }

  // Tür sistemine göre, bu kod yolu asla çalıştırılamaz,
  // bu yüzden neverReturns ile uyumludur.

  return neverReturns();
};

// Tür tanımları, fonksiyona bir kullanıcı nesnesi geçirilmesi gerektiğini belirtse de, 
// JavaScript'teki kaçış noktaları nedeniyle bunu her zaman garanti edemezsiniz.

// never döndüren bir fonksiyon kullanmak, mümkün olmaması gereken 
// yerlerde ek kod eklemenize olanak tanır. 
// Bu, daha iyi hata mesajları göstermek veya dosya/loop gibi kaynakları kapatmak için faydalıdır.

// Never’ın en yaygın kullanım alanlarından biri, switch ifadelerinin 
// kapsayıcı (exhaustive) olmasını sağlamaktır. 

// Örneğin, aşağıda bir enum ve kapsayıcı bir switch ifadesi var. 
// Enum’a yeni bir değer eklemeyi deneyin (örneğin Tulip?).

enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return "Rosa rubiginosa";
    case Flower.Rhododendron:
      return "Rhododendron ferrugineum";
    case Flower.Violet:
      return "Viola reichenbachiana";
    case Flower.Daisy:
      return "Bellis perennis";

    default:
      const _exhaustiveCheck: never = flower;
      return _exhaustiveCheck;
  }
};

// Yeni bir çiçek türü eklediğinizde, TypeScript hata verecektir 
// çünkü yeni tür never ile uyumsuzdur.

// Never’ın Birleşimlerde (Unions) Kullanımı

// never, birleşim türlerinden (union types) otomatik olarak çıkarılır.

type NeverIsRemoved = string | never | number;

// NeverIsRemoved türüne bakarsanız, bunun string | number olduğunu görürsünüz. 
// Bunun nedeni, çalışma zamanında never türüne sahip bir değerin atanamayacak olmasıdır.

// Bu özellik, koşullu türler (conditional types) gibi konularda oldukça sık kullanılır.








