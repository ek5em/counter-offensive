declare module "*.png";
declare module "*.jpeg";
declare module "*.svg";

declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}
