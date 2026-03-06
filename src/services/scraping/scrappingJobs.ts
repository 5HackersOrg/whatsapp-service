import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv();
export interface ScrapeSuccess {
  success?: true;
  scrapped_jobs: any[];
}

export interface ScrapeError {
  success: false;
  message: string;
}

class ScrappingService {
  async scrape(role: string): Promise<any[] | ScrapeError> {
    console.log("going to scrape");
    try {
      const result = await axios.get(
        `${process.env.SCRAPPING_BASE_URL}?job=${encodeURIComponent(role)}`,
      );
      console.log(
        "scrapping result --------------------------------->>>>>>>>>>>>>>>>>.\n",
        result.data,
      );

      if (result.status === 200) {
        return result.data.scrapped_jobs;
      }

      return {
        success: false,
        message: "Unexpected response from scraping service",
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.message,
        };
      }

      return {
        success: false,
        message: (err as Error).message,
      };
    }
  }
}

export default ScrappingService;
