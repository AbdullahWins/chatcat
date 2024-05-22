// DTOs/UserDTO.js

class UserLoginDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList || [];
    this.groupsList = user?.groupsList || [];
    this.eventsList = user?.eventsList || [];
    this.favoritesList = user?.favoritesList || [];
  }
}

class UserRegisterDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList || [];
    this.groupsList = user?.groupsList || [];
    this.eventsList = user?.eventsList || [];
    this.favoritesList = user?.favoritesList || [];
  }
}

class UserFetchDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList || [];
    this.groupsList = user?.groupsList || [];
    this.eventsList = user?.eventsList || [];
    this.favoritesList = user?.favoritesList || [];
  }
}

class UserUpdateDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.fullName = user?.fullName || "";
    this.birthDay = user?.birthDay || "";
    this.gender = user?.gender || "";
    this.hometown = user?.hometown || "";
    this.currentTown = user?.currentTown || "";
    this.yearsOfMoving = user?.yearsOfMoving || "";
    this.occupation = user?.occupation || "";
    this.profileImage = user?.profileImage || "";
    this.coverImage = user?.coverImage || "";
    this.hobbyList = user?.hobbyList || [];
    this.friendsList = user?.friendsList || [];
    this.groupsList = user?.groupsList || [];
    this.eventsList = user?.eventsList || [];
    this.favoritesList = user?.favoritesList || [];
  }
}

class UserDeleteDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.fullName = user?.fullName || "";
    this.email = user?.email || "";
  }
}

//post
class UserPostDTO {
  constructor(user) {
    this._id = user?._id || null;
    this.username = user?.username || "";
    this.fullName = user?.fullName || "";
    // this.gender = user?.gender || "";
    this.profileImage = user?.profileImage || "";
  }
}

module.exports = {
  UserLoginDTO,
  UserRegisterDTO,
  UserFetchDTO,
  UserUpdateDTO,
  UserDeleteDTO,
  UserPostDTO,
};
