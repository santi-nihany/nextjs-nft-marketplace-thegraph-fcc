import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNft.json";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const { chainId } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
    const marketplaceAddress = networkMapping[chainIdString].NftMarketplace[0];

    const { runContractFunction } = useWeb3Contract();

    const dispatch = useNotification();

    async function approveAndList(data) {
        console.log("Approving...");
        const nftAddress = data.data[0].inputResult;
        const tokenId = data.data[1].inputResult;
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString();

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        };

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error);
            },
        });
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now time to list");
        const listOptions = {
            abi: NftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        };

        await runContractFunction({
            params: listOptions,
            onError: (error) => {
                console.log(error);
            },
            onSuccess: handleListSuccess,
        });
    }

    async function handleListSuccess(tx) {
        await tx.wait(1);
        dispatch({
            type: "success",
            title: "NFT Listed",
            message: "NFT Listing",
            position: "topR",
        });
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
        </div>
    );
}
