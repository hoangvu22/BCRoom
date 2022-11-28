module.exports = {
    login: require('./auth/login'),
    register: require('./auth/register'),
    uploadSingleFile: require('./upload/uploadSingleFile'),
    removeSingleFile: require('./upload/removeSingleFile'),
    getHotelsByAddress: require('./hotel/getHotelByAddress'),
    createNewRoomInHotel: require('./core/createNewRoomInHotel'),
    getAllServices: require('./services/getAllServices'),
    getAllRoomTypes: require('./roomTypes/getAllRoomTypes'),
    bookingRoom: require('./core/bookingRoom'),
    getRoomByHotelId: require('./room/getRoomByHotelId'),
    reviewHotel: require('./review/reviewHotel'),
    countHotelsByAddress: require('./hotel/countHotelsByAddress'),
    getReviewOfHotel: require('./review/getReviewOfHotel'),
    getImagesOfHotel: require('./image/getImagesOfHotel'),
    getImagesOfRoom: require('./image/getImagesOfRoom'),
    updateProfile: require('./customer/updateProfile'),
    getHotelById: require('./hotel/getHotelById'),
    getAllBookingOfHotel: require('./owner/getAllBookingOfHotel'),
    getAllOwnHotels: require('./owner/getAllOwnHotels'),
    deleteRoom: require('./room/deleteRoom'),
    deleteHotel: require('./hotel/deleteHotel'),
    updateAvatar: require('./customer/updateAvatar')
}