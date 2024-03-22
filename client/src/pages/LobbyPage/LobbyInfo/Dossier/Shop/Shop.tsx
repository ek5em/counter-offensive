import React, { useState } from "react";
import { Button, EButtonAppearance } from "../../../../../components";

import styles from "./Shop.module.scss";

export enum EShop {
    shop = "shop",
    showcase = "showcase",
}

const Shop: React.FC = () => {
    const [pageContent, setPageContent] = useState<EShop>(EShop.shop);

    return (
        <div className="dossier_shop">
            <div className="shop_menu">
                <Button
                    id="test_button_showcaseOfAchievements"
                    className="dossier_button"
                    active={pageContent === EShop.showcase}
                    appearance={EButtonAppearance.primary}
                    onClick={() => setPageContent(EShop.showcase)}
                >
                    Витрина достижений
                </Button>
                <Button
                    id="test_button_shopOfAchivement"
                    className="dossier_button"
                    active={pageContent === EShop.shop}
                    appearance={EButtonAppearance.primary}
                    onClick={() => setPageContent(EShop.shop)}
                >
                    Магазин достижений
                </Button>
            </div>
            <div className="shop_content">
                {pageContent === "shop" ? (
                    <>
                        <span>
                            “Тут достижения, которые игрок может купить за
                            золото”
                        </span>
                    </>
                ) : (
                    <>
                        <span>“Тут достижения, уже купленные игроком”</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default Shop;
