module waldo_nft_addr::waldo_nft {
    use std::signer;
    use aptos_token::token;
    use std::string;
    use std::vector;

    struct WaldoNFT has key {
        latitude: string::String,
        longitude: string::String,
    }

    public entry fun mint_waldo(
        account: &signer,
        latitude: string::String,
        longitude: string::String,
    ) {
        let collection_name = string::utf8(b"Waldo Collection");
        let token_name = string::utf8(b"Waldo");
        let description = string::utf8(b"A Waldo NFT");
        let token_uri = string::utf8(b"https://api.example.com/waldo/metadata");

        let creator_address = signer::address_of(account);

        // Create collection if it doesn't exist
        if (!token::check_collection_exists(creator_address, collection_name)) {
            token::create_collection_script(
                account,
                collection_name,
                description,
                token_uri,
                1000,  // max supply
                vector[true, true, true]  // mutate flags
            );
        };

        // Mint the token with full parameters
        token::create_token_script(
            account,
            collection_name,
            token_name,
            description,
            1,  // supply
            0,  // max supply
            token_uri,
            signer::address_of(account),  // royalty payee
            1,  // royalty points denominator
            0,  // royalty points numerator 
            vector::empty(),  // empty property list
             vector::empty(),  // property version
             vector::empty(),  // mutate description
             vector::empty()   // mutate uri
        );
    }
}