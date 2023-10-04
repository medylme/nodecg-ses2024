class OsuApiUtils {
  private static readonly apiKey = process.env.OSU_API_KEY;

  public static async testApiKey() {
    if (this.apiKey === undefined) {
      throw new Error("osu! API key not found! Please set it in the .env file as 'OSU_API_KEY'.");
    }

    const endpoint = `https://osu.ppy.sh/api/get_user?k=${this.apiKey}&u=1`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  }

  public static async getMatchData(matchId: string) {
    const endpoint = `https://osu.ppy.sh/api/get_match?k=${this.apiKey}&mp=${matchId}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  }

  public static async getMapData(mapId: string) {
    const endpoint = `https://osu.ppy.sh/api/get_beatmaps?k=${this.apiKey}&b=${mapId}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  }
}

export default OsuApiUtils;
