class AppConfig {

    private readonly baseUrl = process.env.REACT_APP_BASE_URL;

	public readonly vacationsUrl = this.baseUrl + "api/vacations/";
    public readonly addVacationsUrl = this.baseUrl + "api/add-vacation/";
    public readonly updateVacationUrl = this.baseUrl + "api/update-vacation/";
    public readonly userLikeVacationUrl = this.baseUrl + "api/liked-vacations/";
    public readonly vacationsUserIsLikesUrl = this.baseUrl + "api/vacations-isLiked/";
    
	public readonly searchVacationsUrl = this.baseUrl + "api/search-vacations/";

    public readonly registerUrl = this.baseUrl + "api/register/";
    public readonly loginUrl = this.baseUrl + "api/login/";

    public readonly emailsUrl = this.baseUrl + "api/emails/";


    public readonly likeUrl = this.baseUrl + "api/like/";
    public readonly addLikeUrl = this.baseUrl + "api/add-like/";
    public readonly allLikesUrl = this.baseUrl + "api/likes/";

}


export const appConfig = new AppConfig();
