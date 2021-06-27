const decodeExp = (arr: number[]) => {
  let res = BigInt(0);

  let pos = arr.length - 1;
  arr.forEach(v => {
    if (pos == 0) {
      res += BigInt(v);
      console.log(`val: ${v} res: ${res}`);
    } else if (pos == arr.length - 1) {
      console.log('first run');
      res = BigInt(v << (pos * 8));
      console.log(res);
      console.log(`pos: ${pos} val: ${v} res: ${res}`);
    } else {
      //res += BigInt(v << (pos * 8));
      res += BigInt(v) << BigInt(pos * 8);
      console.log(v << (pos * 8));
      console.log(`pos: ${pos} val: ${v} res: ${res}`);
    }
    pos -= 1;
  });
  console.log(res);
};

const encodeExp = () => {
  var myVal = 20000;
  //  var myVal = n58918699885758813231285507404327079076;
  var bytes = [];
  bytes[0] = (myVal & 0xff00) >> 8;
  bytes[1] = myVal & 0x00ff;
  console.log(bytes);
  decodeExp(bytes);
  // console.log((bytes[0] << 8) + bytes[1]);
  //  console.log((bytes[0] << 8));// + bytes[1]);
};
//encodeExp();
//decodeExp(a);
