
describe('logicalEntrySorter', function () {
    var logicalEntrySorter;

    beforeEach(function () {
        logicalEntrySorter = require('../../../utils/logicalEntrySorter');
    });

    describe('sort', function () {
        it('should return daily entries before weekly entries', function () {
            var entries = [
                {
                    typeName: 'Weekly'
                },
                {
                    typeName: 'Daily'
                }
            ];

            var actual = logicalEntrySorter.performSort(entries);
            var expected = [
                {
                    typeName: 'Daily'
                },
                {
                    typeName: 'Weekly'
                }
            ];

            expect(actual).toEqual(expected);
        });

        it('should return daily entries before monthly entries', function () {
            var entries = [
                {
                    typeName: 'Monthly'
                },
                {
                    typeName: 'Daily'
                }
            ];

            var actual = logicalEntrySorter.performSort(entries);
            var expected = [
                {
                    typeName: 'Daily'
                },
                {
                    typeName: 'Monthly'
                }
            ];

            expect(actual).toEqual(expected);
        });

        it('should return weekly entries before monthly entries', function () {
            var entries = [
                {
                    typeName: 'Monthly'
                },
                {
                    typeName: 'Weekly'
                }
            ];

            var actual = logicalEntrySorter.performSort(entries);
            var expected = [
                {
                    typeName: 'Weekly'
                },
                {
                    typeName: 'Monthly'
                }
            ];

            expect(actual).toEqual(expected);
        });

        it('should return daily first, then weekly, then monthly', function () {
            var entries = [
                {
                    typeName: 'Daily'
                },
                {
                    typeName: 'Monthly'
                },
                {  
                    typeName: 'Weekly'
                }
            ];

            var actual = logicalEntrySorter.performSort(entries);
            var expected = [
                {
                    typeName: 'Daily'
                },
                {
                    typeName: 'Weekly'
                },
                {
                    typeName: 'Monthly'
                }
            ];

            expect(actual).toEqual(expected);
        });
    });



});