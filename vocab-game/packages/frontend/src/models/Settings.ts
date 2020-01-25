class SettingsDefinition {
  backendUrl: string;

  public setBackend(url: string) {
    this.backendUrl = url;
  }

  public getAPI(path?: string): string {
    const uri = path !== undefined && path !== null ? path : "";
    return this.backendUrl + uri;
  }
}

const Settings = new SettingsDefinition();
export default Settings;
