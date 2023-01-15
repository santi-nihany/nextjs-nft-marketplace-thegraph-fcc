import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Modal, Input, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification();

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: success,
            message: "Listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        });
        onClose && onClose();
        setPriceToUpdateListingWith("0");
    };

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    });

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => console.log(error),
                    onSuccess: () => handleUpdateListingSuccess(),
                });
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value);
                }}
            ></Input>
        </Modal>
    );
}
