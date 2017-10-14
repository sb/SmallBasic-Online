export interface IPackageInfo {
    title: string;
    version: string;
    description: string;
    repository: string;
}

const packageInfo: IPackageInfo = (window as any).packageInfo;
export default packageInfo;
