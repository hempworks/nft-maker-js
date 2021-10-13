"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateMetadata_1 = require("../src/actions/generateMetadata");
const util_1 = require("../src/util");
jest.mock('../src/util');
const testConfig = {
    name: 'Hemp',
    description: 'Sexy NFTs',
    sellerFeeBasisPoints: 500,
    creators: [
        {
            address: '1234567890',
            share: 100,
        },
    ],
    collection: {
        name: 'Hemp (1st Edition)',
        family: 'Hemp',
    },
    traits: [
        {
            name: 'Background',
            items: [
                { name: 'Midnight', weight: 20 },
                { name: 'Blue', weight: 20 },
            ],
        },
        {
            name: 'Foreground',
            items: [
                { name: 'Red', weight: 20 },
                { name: 'White', weight: 20 },
            ],
        },
    ],
};
const { traits } = testConfig;
describe('createToken', () => {
    it('should return a valid token', async () => {
        const resolveConfigMock = (util_1.resolveConfiguration);
        resolveConfigMock.mockReturnValue(testConfig);
        const shouldIncludeTraitMock = (util_1.shouldIncludeTrait);
        shouldIncludeTraitMock.mockReturnValue(() => true);
        const token = (0, generateMetadata_1.createToken)(69, { Background: 'Midnight', Foreground: 'White' }, testConfig);
        expect(util_1.shouldIncludeTrait).toHaveBeenCalledTimes(2);
        expect(token.name).toEqual('Hemp #69');
        expect(token.description).toEqual('Sexy NFTs');
        expect(token.seller_fee_basis_points).toEqual(500);
        expect(token.collection).toEqual({
            name: 'Hemp (1st Edition)',
            family: 'Hemp',
        });
        expect(token.creators).toEqual([{ address: '1234567890', share: 100 }]);
        expect(token.attributes).toEqual([
            { trait_type: 'Background', value: 'Midnight' },
            { trait_type: 'Foreground', value: 'White' },
        ]);
    });
});