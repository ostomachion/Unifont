(function () {
    const codes = [
        '231A..231B',
        '23E9..23EC',
        '23F0',
        '23F3',
        '25FD..25FE',
        '2614..2615',
        '2648..2653',
        '267F',
        '2693',
        '26A1',
        '26AA..26AB',
        '26BD..26BE',
        '26C4..26C5',
        '26CE',
        '26D4',
        '26EA',
        '26F2..26F3',
        '26F5',
        '26FA',
        '26FD',
        '2705',
        '270A..270B',
        '2728',
        '274C',
        '274E',
        '2753..2755',
        '2757',
        '2795..2797',
        '27B0',
        '27BF',
        '2B1B..2B1C',
        '2B50',
        '2B55',
        '1F004',
        '1F0CF',
        '1F18E',
        '1F191..1F19A',
        '1F1E6..1F1FF',
        '1F201',
        '1F21A',
        '1F22F',
        '1F232..1F236',
        '1F238..1F23A',
        '1F250..1F251',
        '1F300..1F30C',
        '1F30D..1F30E',
        '1F30F',
        '1F310',
        '1F311',
        '1F312',
        '1F313..1F315',
        '1F316..1F318',
        '1F319',
        '1F31A',
        '1F31B',
        '1F31C',
        '1F31D..1F31E',
        '1F31F..1F320',
        '1F32D..1F32F',
        '1F330..1F331',
        '1F332..1F333',
        '1F334..1F335',
        '1F337..1F34A',
        '1F34B',
        '1F34C..1F34F',
        '1F350',
        '1F351..1F37B',
        '1F37C',
        '1F37E..1F37F',
        '1F380..1F393',
        '1F3A0..1F3C4',
        '1F3C5',
        '1F3C6',
        '1F3C7',
        '1F3C8',
        '1F3C9',
        '1F3CA',
        '1F3CF..1F3D3',
        '1F3E0..1F3E3',
        '1F3E4',
        '1F3E5..1F3F0',
        '1F3F4',
        '1F3F8..1F407',
        '1F408',
        '1F409..1F40B',
        '1F40C..1F40E',
        '1F40F..1F410',
        '1F411..1F412',
        '1F413',
        '1F414',
        '1F415',
        '1F416',
        '1F417..1F429',
        '1F42A',
        '1F42B..1F43E',
        '1F440',
        '1F442..1F464',
        '1F465',
        '1F466..1F46B',
        '1F46C..1F46D',
        '1F46E..1F4AC',
        '1F4AD',
        '1F4AE..1F4B5',
        '1F4B6..1F4B7',
        '1F4B8..1F4EB',
        '1F4EC..1F4ED',
        '1F4EE',
        '1F4EF',
        '1F4F0..1F4F4',
        '1F4F5',
        '1F4F6..1F4F7',
        '1F4F8',
        '1F4F9..1F4FC',
        '1F4FF..1F502',
        '1F503',
        '1F504..1F507',
        '1F508',
        '1F509',
        '1F50A..1F514',
        '1F515',
        '1F516..1F52B',
        '1F52C..1F52D',
        '1F52E..1F53D',
        '1F54B..1F54E',
        '1F550..1F55B',
        '1F55C..1F567',
        '1F57A',
        '1F595..1F596',
        '1F5A4',
        '1F5FB..1F5FF',
        '1F600',
        '1F601..1F606',
        '1F607..1F608',
        '1F609..1F60D',
        '1F60E',
        '1F60F',
        '1F610',
        '1F611',
        '1F612..1F614',
        '1F615',
        '1F616',
        '1F617',
        '1F618',
        '1F619',
        '1F61A',
        '1F61B',
        '1F61C..1F61E',
        '1F61F',
        '1F620..1F625',
        '1F626..1F627',
        '1F628..1F62B',
        '1F62C',
        '1F62D',
        '1F62E..1F62F',
        '1F630..1F633',
        '1F634',
        '1F635',
        '1F636',
        '1F637..1F640',
        '1F641..1F644',
        '1F645..1F64F',
        '1F680',
        '1F681..1F682',
        '1F683..1F685',
        '1F686',
        '1F687',
        '1F688',
        '1F689',
        '1F68A..1F68B',
        '1F68C',
        '1F68D',
        '1F68E',
        '1F68F',
        '1F690',
        '1F691..1F693',
        '1F694',
        '1F695',
        '1F696',
        '1F697',
        '1F698',
        '1F699..1F69A',
        '1F69B..1F6A1',
        '1F6A2',
        '1F6A3',
        '1F6A4..1F6A5',
        '1F6A6',
        '1F6A7..1F6AD',
        '1F6AE..1F6B1',
        '1F6B2',
        '1F6B3..1F6B5',
        '1F6B6',
        '1F6B7..1F6B8',
        '1F6B9..1F6BE',
        '1F6BF',
        '1F6C0',
        '1F6C1..1F6C5',
        '1F6CC',
        '1F6D0',
        '1F6D1..1F6D2',
        '1F6D5',
        '1F6D6..1F6D7',
        '1F6DC',
        '1F6DD..1F6DF',
        '1F6EB..1F6EC',
        '1F6F4..1F6F6',
        '1F6F7..1F6F8',
        '1F6F9',
        '1F6FA',
        '1F6FB..1F6FC',
        '1F7E0..1F7EB',
        '1F7F0',
        '1F90C',
        '1F90D..1F90F',
        '1F910..1F918',
        '1F919..1F91E',
        '1F91F',
        '1F920..1F927',
        '1F928..1F92F',
        '1F930',
        '1F931..1F932',
        '1F933..1F93A',
        '1F93C..1F93E',
        '1F93F',
        '1F940..1F945',
        '1F947..1F94B',
        '1F94C',
        '1F94D..1F94F',
        '1F950..1F95E',
        '1F95F..1F96B',
        '1F96C..1F970',
        '1F971',
        '1F972',
        '1F973..1F976',
        '1F977..1F978',
        '1F979',
        '1F97A',
        '1F97B',
        '1F97C..1F97F',
        '1F980..1F984',
        '1F985..1F991',
        '1F992..1F997',
        '1F998..1F9A2',
        '1F9A3..1F9A4',
        '1F9A5..1F9AA',
        '1F9AB..1F9AD',
        '1F9AE..1F9AF',
        '1F9B0..1F9B9',
        '1F9BA..1F9BF',
        '1F9C0',
        '1F9C1..1F9C2',
        '1F9C3..1F9CA',
        '1F9CB',
        '1F9CC',
        '1F9CD..1F9CF',
        '1F9D0..1F9E6',
        '1F9E7..1F9FF',
        '1FA70..1FA73',
        '1FA74',
        '1FA75..1FA77',
        '1FA78..1FA7A',
        '1FA7B..1FA7C',
        '1FA80..1FA82',
        '1FA83..1FA86',
        '1FA87..1FA88',
        '1FA89',
        '1FA8F',
        '1FA90..1FA95',
        '1FA96..1FAA8',
        '1FAA9..1FAAC',
        '1FAAD..1FAAF',
        '1FAB0..1FAB6',
        '1FAB7..1FABA',
        '1FABB..1FABD',
        '1FABE',
        '1FABF',
        '1FAC0..1FAC2',
        '1FAC3..1FAC5',
        '1FAC6',
        '1FACE..1FACF',
        '1FAD0..1FAD6',
        '1FAD7..1FAD9',
        '1FADA..1FADB',
        '1FADC',
        '1FADF',
        '1FAE0..1FAE7',
        '1FAE8',
        '1FAE9',
        '1FAF0..1FAF6',
        '1FAF7..1FAF8'
    ];

    window.emojiPresentationCodePoints = [];

    for (const code of codes) {
        let start, end;
        if (code.includes('..')) {
            const parts = code.split('..', 2);
            start = parseInt(parts[0], 16);
            end = parseInt(parts[1], 16);
        } else {
            start = parseInt(code, 16);
            end = start;
        }

        for (let c = start; c <= end; c++) {
            window.emojiPresentationCodePoints.push(c);
        }
    }
})();
