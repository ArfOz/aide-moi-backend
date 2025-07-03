const User = require('../entities/User');

class UserService {
  constructor(dataSource) {
    this.userRepository = dataSource.getRepository(User);
  }

  async findAll() {
    return await this.userRepository.find({
      order: { id: 'ASC' }
    });
  }

  async findById(id) {
    return await this.userRepository.findOne({
      where: { id: parseInt(id) }
    });
  }

  async findByEmail(email) {
    return await this.userRepository.findOne({
      where: { email }
    });
  }

  async create(userData) {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id, userData) {
    await this.userRepository.update(id, userData);
    return await this.findById(id);
  }

  async delete(id) {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  async count() {
    return await this.userRepository.count();
  }
}

module.exports = UserService;
