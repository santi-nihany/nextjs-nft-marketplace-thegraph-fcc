import NFTBox from "../components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis } from "react-moralis";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";

export default function Home() {
    const { chainId, isWeb3Enabled } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : null;
    if (chainId == 5) {
        const marketplaceAddress = chainId
            ? networkMapping[chainIdString].NftMarketplace[0]
            : null;
    }

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled && chainId == 5 ? (
                    // if it's loading or don't have listed NFTs
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            let marketplaceAddress = chainId
                                ? networkMapping[chainIdString].NftMarketplace[0]
                                : null;
                            const { price, nftAddress, tokenId, seller } = nft;
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            );
                        })
                    )
                ) : (
                    <div>
                        <div>Web3 Currently Not Enabled</div>
                        <div>We only support goerli testnet</div>
                    </div>
                )}
            </div>
        </div>
    );
}
