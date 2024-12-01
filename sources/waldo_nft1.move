module waldo_nft_addr::waldo_nft {
    use aptos_stdlib::signer::Signer;
    use aptos_token::token;
    use std::string;
    use std::vector;

    struct WaldoNFT has key {
        latitude: string::String,
        longitude: string::String,
    }

    public entry fun mint_waldo(
        account: &Signer,
        latitude: string::String,
        longitude: string::String,
    ) {
        let collection_name = string::utf8(b"Waldo Collection");
        let token_name = string::utf8(b"Waldo");
        let description = string::utf8(b"A Waldo NFT");
        let token_uri = string::utf8(b"https://api.example.com/waldo/metadata");

        // Create collection if it doesn't exist
        if (!token::exists_collection(account, &collection_name)) {
            token::create_collection(
                account,
                collection_name.clone(),
                description.clone(),
                token_uri.clone(),
                1000,  // max_supply
                vector::empty<u8>(),                 // royalty_payee_address
                0,                                   // royalty_points_denominator
                0,                                   // royalty_points_numerator
                vector::empty<token::PropertyMap>(), // default_properties
                false                                // allow_mutable_description
            );
        };

        // Mint the token
        token::create_token(
            account,
            collection_name,
            token_name,
            description,
            1,                                    // supply
            0,                                    // max_supply
            token_uri,
            vector::empty<u8>(),                  // royalty_payee_address
            0,                                    // royalty_points_denominator
            0,                                    // royalty_points_numerator
            vector::empty<token::PropertyMap>(),  // properties
            false,                                // allow_mutable_description
            false                                 // allow_mutable_uri
        );
    }
}