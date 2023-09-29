const cemeteryData = [
    {
      Zone: 5,
      CEMETERY_NAME: "Pick Up",
      ADDRESS: "15715 North Freeway Service Road Houston, TX 77090",
      CONTACT_NAME: "Mai Le",
      PHONE: "713-597-8899",
      EMAIL: "headstoneworld@yahoo.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Addison Funeral Home",
      ADDRESS: "18630 Kuykendahl Rd, Spring, TX 77379",
      CONTACT_NAME: "Joshua",
      PHONE: "281 350-0998",
      EMAIL: "addisonfh@yahoo.com"
    },
    {
      Zone: 2,
      CEMETERY_NAME: "Brookside Cemetery",
      ADDRESS: "13747 Eastex Freeway Houston TX 77039",
      CONTACT_NAME: "Isabel Gomez",
      PHONE: "281 449-6511",
      EMAIL: "isabel.gomez@sci-us.com"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Calvary Hill Cemetery",
      ADDRESS: "21723 Aldine Westfield Road Humble Texas 77338",
      CONTACT_NAME: "PHILLIP",
      PHONE: "281 443-3340",
      EMAIL: "phillip.starnes@dignitymemorial.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Carmen Nelson Bostick Cemetery",
      ADDRESS: "12317 Holderrieth Rd, Tomball, TX 77375",
      CONTACT_NAME: "Jim Pinkspon",
      PHONE: "281 256-3635",
      EMAIL: "cnbcemetery@gmail.com"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Earthman Baytown",
      ADDRESS: "8624 Garth Rd Baytown Tx 77521",
      CONTACT_NAME: "LAURA",
      PHONE: "281 422-8181",
      EMAIL: "Laura.GuerraLeon@sci-us.com"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Earthman Resthaven",
      ADDRESS: "13102 North Freeway Houston",
      CONTACT_NAME: "GERI",
      PHONE: "281 443-0063",
      EMAIL: "geralyn.murphy@dignitymemorial.com"
    },
    {
      Zone: 0,
      CEMETERY_NAME: "Evergreen Cemetery",
      ADDRESS: "500 Altic Street Houston Tx 77012",
      PHONE: "713 880-2828"
    },
    {
      Zone: 3,
      CEMETERY_NAME: "Forest Lawn",
      ADDRESS: "8061 Almeda Genoa Road Houston Tx 77075",
      CONTACT_NAME: "KENDALL",
      PHONE: "713 991-2313",
      EMAIL: "kmoore@plcorp.com"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Forest Park East Cemetery",
      ADDRESS: "21620 Gulf Fwy Webster Tx 77598",
      PHONE: "281-332-7696",
      EMAIL: "misty.kautzmann@dignitymemorial.com"
    },
    {
      Zone: 0,
      CEMETERY_NAME: "Forest Park Lawndale",
      ADDRESS: "6900 Lawndale St, Houston, TX 77023",
      CONTACT_NAME: "ALONDRA",
      PHONE: "713 928-5141",
      EMAIL: "713 921 6626"
    },
    {
      Zone: 4,
      CEMETERY_NAME: "Forest Park Southwest",
      ADDRESS: "9040 FM 359 Richmond, Texas 77406",
      CONTACT_NAME: "Stacy-Christine",
      PHONE: "281-394-0067",
      EMAIL: "Stacy.Woodard@sci-us.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Forest Park the Woodland Cemetery",
      ADDRESS: "18000 Interstate 45 S, The Woodlands, TX 7738",
      CONTACT_NAME: "Ami",
      PHONE: "936 321-5115",
      EMAIL: "amy.mcdaniel@dignitymemorial.com"
    },
    {
      Zone: 4,
      CEMETERY_NAME: "Forest Park Westheimer",
      ADDRESS: "12800 Westheimer Rd, Houston, TX 77077",
      CONTACT_NAME: "VERONA / Betty",
      PHONE: "281 497-2330",
      EMAIL: "verona.nda@dignitymemorial.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Forest Park Woodlands",
      ADDRESS: "18000 I-45, Conroe, TX 77384",
      CONTACT_NAME: "AMY",
      PHONE: "936 321-5115"
    },
    {
      Zone: 4,
      CEMETERY_NAME: "Fulshear Cemetery",
      ADDRESS: "7420 Wallis St, Fulshear, TX 77441",
      CONTACT_NAME: "Frances Delacruz",
      PHONE: "832 868-1147"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Galveston Memorial Park Cemetery",
      ADDRESS: "7301 Memorial St, Hitchcock, TX 77563",
      PHONE: "409 986-7409"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Garden Park Cemetery",
      ADDRESS: "801 Teas Rd, Conroe, TX 77303",
      CONTACT_NAME: "MICHELLE",
      PHONE: "936 756-2126"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Grand View Funeral Home & Memorial Park/ Bethany",
      ADDRESS: "8501 Spencer Hwy. Pasadena Tx 77505",
      CONTACT_NAME: "SHARONDA",
      PHONE: "281 479-6076"
    },
    {
      Zone: 4,
      CEMETERY_NAME: "Green Lawn Cemetery",
      ADDRESS: "3900 B F Terry Blvd, Rosenberg, TX 77471",
      CONTACT_NAME: "PAT",
      PHONE: "281-341-2200"
    },
    {
      Zone: 0,
      CEMETERY_NAME: "Hollywood Cemetery",
      ADDRESS: "3506 N Main St, Houston, TX 77009",
      CONTACT_NAME: "VERONICA",
      PHONE: "713 227-5109",
      EMAIL: "vjohnson@hhcemetery.com"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Houston Memorial Garden",
      ADDRESS: "2426 Cullen Blvd, Pearland, TX 77581",
      PHONE: "281 485-2221",
      EMAIL: "houstonmemorialgardens@gmail.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Klein Cemetery (Spring)",
      ADDRESS: "6619 Klein Cemetery Rd, Spring, TX 77379",
      PHONE: "281 351-7233"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Klein Cemetery (Cypress)",
      ADDRESS: "14711 Cypress North Houston Rd, Cypress, TX 77429",
      PHONE: "832 678-3900"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Klein Cemetery (Tomball)",
      ADDRESS: "9714 Farm to Market 2920, Tomball, TX 77375",
      CONTACT_NAME: "RHONDA",
      PHONE: "281 320-2674",
      EMAIL: "markers@kleinfh.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Klein Cemetery (Pinehurst)",
      ADDRESS: "32509 TX-249, Pinehurst, TX 77362",
      PHONE: "281 351-7233"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Klein Cemetery (Magnolia)",
      ADDRESS: "14711 Farm to Market Rd 1488, Magnolia, TX 77354",
      PHONE: "281 252-3428"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Mainland Memorial Cemetery",
      ADDRESS: "6602 O Brien St Hitchcock TX 77563",
      CONTACT_NAME: "Russel",
      PHONE: "409 502-1504"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Macedonia Cemetery Association",
      ADDRESS: "26059 Springer Cemetery Rd Hockley, TX 77447",
      EMAIL: "macedonia_cemetery@hotmail.com"
    },
    {
      Zone: 0,
      CEMETERY_NAME: "Magnolia Cemetery",
      ADDRESS: "816 Montrose Blvd, Houston, TX 77019",
      CONTACT_NAME: "GLEN",
      PHONE: "713 249 0869"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Magnolia Memorial Garden",
      ADDRESS: "811 Magnolia Blvd, Magnolia, TX 77355",
      PHONE: "281 356 3363"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "McNutt Funeral Home | Conroe Memorial Park",
      ADDRESS: "1703 Porter Road Conroe, Tx 77301",
      CONTACT_NAME: "Andrea Vela",
      PHONE: "616-828-5731",
      EMAIL: "avela@mcnuttfuneralhome.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Memorial Park Conroe",
      ADDRESS: "1600 Porter Rd, Conroe, TX 77301",
      PHONE: "936 756-4082"
    },
    {
      Zone: 4,
      CEMETERY_NAME: "Memorial Oak",
      ADDRESS: "13001 Kathy Fwy. Houston Tx 77079",
      CONTACT_NAME: "CATHY",
      PHONE: "281 497 2210",
      EMAIL: "cathy.chaviers@dignitymemorial.com"
    },
    {
      Zone: 2,
      CEMETERY_NAME: "Morales Cemetery / Santa Teresa",
      ADDRESS: "14605 Luthe Rd, Houston, TX 77039",
      PHONE: "281 987-3100"
    },
    {
      Zone: 4,
      CEMETERY_NAME: "Morton Cemetery",
      ADDRESS: "900 Morton St, Richmond, TX 77469",
      CONTACT_NAME: "DAVID",
      PHONE: "281-239-3648",
      EMAIL: "info@mortoncemetery.com"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Mt Olivet Catholic Cemetery",
      ADDRESS: "7801 Gulf Fwy, Dickinson, TX 77539",
      CONTACT_NAME: "KEN",
      PHONE: "281 337-1641",
      EMAIL: "ksuderman@archgh.org"
    },
    {
      Zone: 1,
      CEMETERY_NAME: "Paradise North",
      ADDRESS: "10401 W Montgomery Road 77088",
      CONTACT_NAME: "DREW",
      PHONE: "281 445 1201",
      EMAIL: "andrew.todd@sci-us.com"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "Paradise South",
      ADDRESS: "2237 Cullen Blvd Pearland 77581",
      CONTACT_NAME: "DREW",
      PHONE: "281 445 1201",
      EMAIL: "andrew.todd@sci-us.com"
    },
    {
      Zone: 1,
      CEMETERY_NAME: "Paradise - Golden Gate",
      ADDRESS: "8400 Hirsch Rd Houston 77016",
      CONTACT_NAME: "DREW",
      PHONE: "281 445 1201",
      EMAIL: "andrew.todd@sci-us.com"
    },
    {
      Zone: 1,
      CEMETERY_NAME: "Paradise - Cemetery Beautiful",
      ADDRESS: "8401 Wheatley St, Houston, TX 77088",
      CONTACT_NAME: "DREW",
      PHONE: "281 445 1201",
      EMAIL: "andrew.todd@sci-us.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "PERRY CEMETERY",
      ADDRESS: "13214 E Cypress Forest Drive Houston Tx 77070",
      CONTACT_NAME: "Mrs. Hargrove",
      PHONE: "281-379-1645"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Rosewood Porter",
      ADDRESS: "22271 Hwy 59 N Porter TX 77365",
      PHONE: "281441-2171"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Rosewood in Humble",
      ADDRESS: "2602 Old Humble Road, Humble TX 77392",
      CONTACT_NAME: "RON",
      PHONE: "281 441 2171",
      EMAIL: "rlofton@rosewood.cc"
    },
    {
      Zone: 2,
      CEMETERY_NAME: "San Jacinto Cemetery",
      ADDRESS: "14659 East Fwy. Houston tx 77015",
      CONTACT_NAME: "AMELIA",
      PHONE: "832 239 8858",
      EMAIL: "amelia.cerda@sjfunerals.com"
    },
    {
      Zone: 2,
      CEMETERY_NAME: "Santa Teresa Cemetery",
      ADDRESS: "912 Buschong St, Houston, TX 77039",
      CONTACT_NAME: "Rosey /Norma",
      PHONE: "281 987-3100",
      EMAIL: "nsegovia@santateresacemetery.com"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Sam Houston Memorial Willis",
      ADDRESS: "10129 FM 1097 Rd. Willis TX 77318",
      PHONE: "936 890-0454"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "SCHMIDT FUNERAL HOME",
      ADDRESS: "1508 East Avenue Katy, TX 77493",
      PHONE: "281 391-2424"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Smith Memorial Park",
      ADDRESS: "10129 FM 1097, Willis, TX 77318",
      PHONE: "936 890-0454"
    },
    {
      Zone: 7,
      CEMETERY_NAME: "South Park Memorial Cemetery",
      ADDRESS: "1310 N Main St, Pearland, TX 77581",
      CONTACT_NAME: "Yesenia",
      PHONE: "281 485-2711",
      EMAIL: "Yesenia.Reyes@nsmg.com"
    },
    {
      Zone: 6,
      CEMETERY_NAME: "Sterling White",
      ADDRESS: "11011 Crosby Lynchburg Rd, Highlands, TX 77562",
      CONTACT_NAME: "Savannah Cook",
      PHONE: "281 426 3555"
    },
    {
      Zone: 5,
      CEMETERY_NAME: "Tranquility Oaks Cemetery",
      ADDRESS: "22396 Highdebrandt Rd Spring TX 77389",
      CONTACT_NAME: "JEKE",
      PHONE: "281 350 0998"
    },
    {
      Zone: 1,
      CEMETERY_NAME: "Woodlawn Garden of Memories Cemetery",
      ADDRESS: "1101 Antoine Dr, Houston, TX 77055",
      CONTACT_NAME: "DEBRA",
      PHONE: "713 682 0517",
      EMAIL: "debra@woodlawnfh.com"
    }
  ];
  
  export default cemeteryData;
  