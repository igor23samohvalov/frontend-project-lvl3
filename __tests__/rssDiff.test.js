// import rssDiff from "../src/rssDiff.js";

// let testArray1;
// let testObj1;
// let testResult1;

// beforeAll(() => {
//   testArray1 = [{
//     feed: {
//       title: 'feedTitle',
//       description: 'description',
//     },
//     posts: [
//       {      
//         link: 'https://www.example.com/',
//         title: 'postTitle1',
//         description: 'postDescription1',
//         clicked: false,
//       },
//       {      
//         link: 'https://www.example3.com/',
//         title: 'postTitle3',
//         description: 'postDescription3',
//         clicked: false,
//       }
//     ],
//     url: 'url',
//   }];
//   testObj1 = {
//     feed: {
//       title: 'feedTitle',
//       description: 'description',
//     },
//     posts: [{      
//       link: 'https://www.example.com/',
//       title: 'postTitle1',
//       description: 'postDescription1',
//       clicked: false,
//     },
//     {      
//       link: 'https://www.example1.com/',
//       title: 'postTitle2',
//       description: 'postDescription2',
//       clicked: false,
//     },
//   ],
//     url: 'url',
//   };
//   testResult1 = [{
//     feed: {
//       title: 'feedTitle',
//       description: 'description',
//     },
//     posts: [
//       {      
//         link: 'https://www.example.com/',
//         title: 'postTitle1',
//         description: 'postDescription1',
//         clicked: false,
//       },
//       {      
//         link: 'https://www.example1.com/',
//         title: 'postTitle2',
//         description: 'postDescription2',
//         clicked: false,
//       },
//       {      
//         link: 'https://www.example3.com/',
//         title: 'postTitle3',
//         description: 'postDescription3',
//         clicked: false,
//       }
//     ],
//     url: 'url',
//   }]
// })

// test('rssDiff does nothing if args are empty', () => {
//   expect(rssDuff([], []).toEqual(undefined))
//   expect(rssDuff(testArray1, testObj1)).toEqual()
// })